const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const {
  Email,
  validationCreateEmail,
  validationUpdateEmail,
} = require("../models/Email");
const { User } = require("../models/User");
const sendEmailFunction = require("../utils/sendEmail");
const {
  uploadFile,
  downloadFile,
  getUrl,
  deleteFile,
} = require("../utils/firebase");
const { Attachment } = require("../models/Attachment");

/**--------------------------------
 * @desc    create email
 * @router  /api/emails/create
 * @method  POST
 * @access  public
----------------------------------*/

module.exports.createEmailCtrl = asyncHandler(async (req, res) => {
  req.body.emails = [...new Set(req.body.emails)];

  const { error } = validationCreateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let email = await Email.create({
    from: req.user.id,
    subject: req.body.subject,
    body: req.body.body,
  });
  for (let i = 0; i < req.files.length; i++) {
    let file = req.files[i];
    file.originalname =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;

    await uploadFile(file).then(async () => {
      let url = await getUrl(file.originalname);
      await Attachment.create({
        email: email._id,
        filename: file.originalname,
        url: url,
        type: file.mimetype,
      });
    });
  }

  req.body.emails.forEach(async (reciverEmail) => {
    let toUser = await User.findOne({ email: reciverEmail });
    if (!toUser) {
      res.status(404).json({ message: `this ${reciverEmail} not found` });
    } else {
      // add receiver id in to field
      email = await Email.findByIdAndUpdate(
        email._id,
        { $push: { to: toUser._id } },
        { new: true }
      );
    }
  });
  const emailData = { _id: email._id, status: "draft" };
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { emails: emailData } },
    { new: true }
  );
  email = await Email.findByIdAndUpdate(
    email._id,
    { $push: { users: req.user.id } },
    { new: true }
  ).populate("attachments");

  return res.status(201).json(email);
});

/**--------------------------------
 * @desc    get all emails
 * @router  /api/emails/getAllEmails
 * @method  GET
 * @access  private (only user himself)
----------------------------------*/

module.exports.getAllEmailsCtrl = asyncHandler(async (req, res) => {
  let emails = await User.findById({ _id: req.user.id })
    .select("-password")
    .populate("emailsRef");
  // emails = emails.emails;
  res.status(200).json(emails);
});

/**--------------------------------
 * @desc    get single email
 * @router  /api/emails/:id
 * @method  GET
 * @access  public (only user himself)
----------------------------------*/

module.exports.getEmailCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let email = await Email.findById(id).populate(["usersData", "attachments"]);
  if (!email) {
    return res.status(404).json({ message: "email not found" });
  }
  let sendData = {
    _id: "",
    from: "",
    to: [],
    subject: "",
    body: "",
    attachment: [],
    createdAt: "",
    updatedAt: "",
    __v: "",
    sentAt: "",
    status: "",
  };
  sendData._id = email._id;
  sendData.subject = email.subject;
  sendData.body = email.body;
  sendData.attachment = email.attachments;
  sendData.createdAt = email.createdAt;
  sendData.updatedAt = email.updatedAt;
  sendData.__v = email.__v;
  sendData.sentAt = email.sentAt;
  sendData.from = await User.findById(email.from.toString()).select(
    "-password"
  );
  for (let j = 0; j < email.to.length; j++) {
    sendData.to.push(
      await User.findById(email.to[j].toString()).select("-password")
    );
  }
  let s = await User.findById(req.user.id).select("emails");
  sendData.status = s.emails.find(
    (e) => e._id.toString() === req.params.id
  ).status;
  if (sendData) {
    res.status(200).json(sendData);
  } else {
    res.status(404).json({ message: "email not found" });
  }
});

/**--------------------------------
 * @desc    update email
 * @router  /api/emails/:id
 * @method  PUT
 * @access  private (only user himself)
----------------------------------*/

module.exports.updateEmailCtrl = asyncHandler(async (req, res) => {
  req.body.emails = [...new Set(req.body.emails)];
  console.log(">>>>>>>>>>>>.", req.files);
  const { error } = validationUpdateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let sendEmail = await Email.findById(req.params.id);
  if (!sendEmail) {
    return res
      .status(404)
      .json({ message: "email has not found", email: sendEmail });
  }
  if (sendEmail.from.toString() !== req.user.id) {
    // check if this post belong to logged user
    return res.status(403).json({ message: "Access denied, forbidden" });
  }
  let recipients = [];
  for (let i = 0; i < req.body.emails.length; i++) {
    let toUser = await User.findOne({ email: req.body.emails[i] });
    if (!toUser) {
      res.status(404).json({ message: `this ${recipient} not found` });
    } else {
      recipients.push(toUser._id);
    }
  }

  for (let i = 0; i < req.files.length; i++) {
    let file = req.files[i];
    file.originalname =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;

    await uploadFile(file).then(async () => {
      let url = await getUrl(file.originalname);
      await Attachment.create({
        email: req.params.id,
        filename: file.originalname,
        url: url,
        type: file.mimetype,
      });
    });
  }

  const updateEmail = await Email.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        to: recipients,
        subject: req.body.subject,
        body: req.body.body,
      },
    },
    { new: true }
  );
  return res.status(200).json({
    updateEmail,
  });
});

/**--------------------------------
 * @desc    Delete email
 * @router  /api/emails/:id
 * @method  DELETE
 * @access  private (userhimself)
----------------------------------*/

module.exports.deleteEmailCtrl = asyncHandler(async (req, res) => {
  let emails = await User.findById(req.user.id).select("emails");
  if (!emails) {
    return res.status(404).json({ message: "email not found " });
  }
  emails = emails.emails;
  let index = -1;
  let email;
  let user;
  for (let i = 0; i < emails.length; i++) {
    console.log(emails[i]);
    if (emails[i]._id.toString() === req.params.id) {
      index = i;
      email = emails[i];
    }
  }
  if (!email) {
    return res
      .status(404)
      .json({ message: "email not found on you not have access" });
  }
  if (index > -1) {
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { emails: emails.toSpliced(index, 1) } },
      { new: true }
    );
    email = await Email.findByIdAndUpdate(
      email._id,
      { $pull: { users: req.user.id } },
      { new: true }
    );
  }

  if (email.users.length === 0) {
    email = await Email.findByIdAndDelete(email._id).populate("attachments");
    for (let i = 0; i < email.attachments.length; i++) {
      await Attachment.findByIdAndDelete(email.attachments[i]._id).then(
        (doc) => {
          deleteFile(doc.filename);
        }
      );
    }
  }
  if (user) {
    return res
      .status(200)
      .json({ message: "email has been deleted", email: email });
  } else {
    return res
      .status(404)
      .json({ message: "email not found on you not have access" });
  }
});

/**--------------------------------
 * @desc    send email internal
 * @router  /api/emails/send-internal/:id
 * @method  PUT
 * @access  private (userhimself)
----------------------------------*/

module.exports.sendEmailInternalCtrl = asyncHandler(async (req, res) => {
  let sendEmail = await Email.findById(req.params.id);
  if (!sendEmail) {
    return res
      .status(404)
      .json({ message: "email has not found", email: sendEmail });
  }

  if (sendEmail.from.toString() !== req.user.id) {
    // check if this post belong to logged user
    return res.status(403).json({ message: "Access denied, forbidden" });
  }
  let userEmails = await User.findById(req.user.id).select("emails");
  userEmails = userEmails.emails;
  let index;
  let userEmail;
  //get index of email
  for (let i = 0; i < userEmails.length; i++) {
    if (userEmails[i]._id.toString() === req.params.id) {
      index = i;
      userEmail = userEmails[i];
    }
  }
  if (userEmail.status === "sent") {
    return res
      .status(404)
      .json({ message: "email has been sent before", email: userEmail });
  }

  //   //get send email
  //   //add id to users in Email document
  await Email.findByIdAndUpdate(
    sendEmail._id,
    { $push: { users: sendEmail.to } },
    { new: true }
  );
  await Email.findByIdAndUpdate(
    sendEmail._id,
    { $set: { sentAt: new Date() } },
    { new: true }
  );
  //   //get recieverId
  let recieverIds = sendEmail.to;
  console.log("recieverIds", recieverIds);
  //send email internal
  let userEmailUpdate = { _id: userEmail._id.toString(), status: "inbox" };
  // add email id in receiver mails
  for (let i = 0; i < recieverIds.length; i++) {
    await User.findByIdAndUpdate(
      recieverIds[i]._id.toString(),
      { $push: { emails: userEmailUpdate } },
      { new: false }
    );
  }
  //change mail from draft to sent
  userEmailUpdate = { _id: userEmail._id.toString(), status: "sent" };
  // delete email from draft
  const user = await User.findOne({ _id: req.user.id });
  if (index >= 0 && index < user.emails.length) {
    user.emails.splice(index, 1);
  } else {
    console.log("Invalid index");
    return res.status(400).json({ message: "Invalid index" });
  }
  await User.updateOne({ _id: req.user.id }, { $set: { emails: user.emails } });

  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { emails: userEmailUpdate } },
    { new: false }
  );
  res.status(200).json({ message: "email has been sent", email: sendEmail });
});

/**--------------------------------
 * @desc    send email internal
 * @router  /api/emails/send-internal
 * @method  POST
 * @access  private (userhimself)
----------------------------------*/

module.exports.sendEmailCtrl = asyncHandler(async (req, res) => {
  req.body.emails = [...new Set(req.body.emails)];

  const { error } = validationCreateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let email = await Email.create({
    from: req.user.id,
    subject: req.body.subject,
    body: req.body.body,
  });

  for (let i = 0; i < req.files.length; i++) {
    let file = req.files[i];
    file.originalname =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;

    await uploadFile(file).then(async () => {
      let url = await getUrl(file.originalname);
      await Attachment.create({
        email: email._id,
        filename: file.originalname,
        url: url,
        type: file.mimetype,
      });
    });
  }

  req.body.emails.forEach(async (reciverEmail) => {
    let toUser = await User.findOne({ email: reciverEmail });
    if (!toUser) {
      res.status(404).json({ message: `this ${reciverEmail} not found` });
    } else {
      // add receiver id in to field
      email = await Email.findByIdAndUpdate(
        email._id,
        { $push: { to: toUser._id } },
        { new: true }
      );
    }
  });
  const emailData = { _id: email._id, status: "draft" };
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { emails: emailData } },
    { new: true }
  );
  email = await Email.findByIdAndUpdate(
    email._id,
    { $push: { users: req.user.id } },
    { new: true }
  ).populate("attachments");

  let sendEmail = await Email.findById(email._id);
  if (!sendEmail) {
    return res
      .status(404)
      .json({ message: "email has not found2", email: sendEmail });
  }

  if (sendEmail.from.toString() !== req.user.id) {
    // check if this post belong to logged user
    return res.status(403).json({ message: "Access denied, forbidden" });
  }
  let userEmails = await User.findById(req.user.id).select("emails");
  userEmails = userEmails.emails;
  let index;
  let userEmail;
  //get index of email
  for (let i = 0; i < userEmails.length; i++) {
    if (userEmails[i]._id.toString() === email._id.toString()) {
      index = i;
      userEmail = userEmails[i];
    }
  }
  if (userEmail.status === "sent") {
    return res
      .status(404)
      .json({ message: "email has been sent before", email: userEmail });
  }

  //   //get send email
  //   //add id to users in Email document
  await Email.findByIdAndUpdate(
    sendEmail._id,
    { $push: { users: sendEmail.to } },
    { new: true }
  );
  await Email.findByIdAndUpdate(
    sendEmail._id,
    { $set: { sentAt: new Date() } },
    { new: true }
  );
  //   //get recieverId
  let recieverIds = sendEmail.to;
  console.log("recieverIds", recieverIds);
  //send email internal
  let userEmailUpdate = { _id: userEmail._id.toString(), status: "inbox" };
  // add email id in receiver mails
  for (let i = 0; i < recieverIds.length; i++) {
    await User.findByIdAndUpdate(
      recieverIds[i]._id.toString(),
      { $push: { emails: userEmailUpdate } },
      { new: false }
    );
  }
  //change mail from draft to sent
  userEmailUpdate = { _id: userEmail._id.toString(), status: "sent" };
  // delete email from draft
  const user = await User.findOne({ _id: req.user.id });
  if (index >= 0 && index < user.emails.length) {
    user.emails.splice(index, 1);
  } else {
    console.log("Invalid index");
    return res.status(400).json({ message: "Invalid index" });
  }
  await User.updateOne({ _id: req.user.id }, { $set: { emails: user.emails } });

  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { emails: userEmailUpdate } },
    { new: false }
  );
  res.status(200).json({ message: "email has been sent", email: sendEmail });
});

/**--------------------------------
 * @desc    send email by gmail
 * @router  /api/emails/send/:id
 * @method  PUT
 * @access  private (userhimself)
----------------------------------*/
module.exports.sendEmailByGmailCtrl = asyncHandler(async (req, res) => {
  let sendEmail = await Email.findById(req.params.id);
  if (!sendEmail) {
    return res
      .status(404)
      .json({ message: "email has not found", email: sendEmail });
  } else {
    if (sendEmail.from.toString() !== req.user.id) {
      // check if this post belong to logged user
      return res.status(403).json({ message: "Access denied, forbidden" });
    }

    let userEmails = await User.findById(req.user.id).select("emails");
    userEmails = userEmails.emails;
    let index;
    let userEmail;
    //get index of email
    for (let i = 0; i < userEmails.length; i++) {
      if (userEmails[i]._id.toString() === req.params.id) {
        index = i;
        userEmail = userEmails[i];
      }
    }

    if (userEmail.status === "sent") {
      return res
        .status(404)
        .json({ message: "email has been sent before", email: userEmail });
    }

    //   //get send email
    //   //add id to users in Email document
    await Email.findByIdAndUpdate(
      sendEmail._id,
      { $push: { users: sendEmail.to } },
      { new: true }
    );
    await Email.findByIdAndUpdate(
      sendEmail._id,
      { $set: { sentAt: new Date() } },
      { new: true }
    );
    //   //get recieverId
    let recieverIds = sendEmail.to;
    //send email internal
    let userEmailUpdate = { _id: userEmail._id.toString(), status: "inbox" };
    let htmlTemplate = `<div>
  <p>${sendEmail.body}</p>
</div>`;
    //get recieverId
    let sender = await User.findById(sendEmail.from.toString());
    let receiver = [];
    for (let i = 0; i < recieverIds.length; i++) {
      let x = await User.findById(recieverIds[i].toString());

      receiver.push(x.email);
    }

    checkSend = await sendEmailFunction(
      sender.email,
      receiver,
      sendEmail.subject,
      sendEmail.body,
      sendEmail.attachment,
      htmlTemplate
    );
    if (!checkSend) {
      return res
        .status(404)
        .json({ message: "email send failed", email: this.sendEmail });
    }
    await setTimeout(() => {
      for (let i = 0; i < sendEmail.attachment.length; i++) {
        fs.unlinkSync(sendEmail.attachment[i].path);
      }
    }, 5000);
    // add email id in receiver mails
    for (let i = 0; i < recieverIds.length; i++) {
      await User.findByIdAndUpdate(
        recieverIds[i]._id.toString(),
        { $push: { emails: userEmailUpdate } },
        { new: false }
      );
    }

    //change mail from draft to sent
    userEmailUpdate = { _id: userEmail._id.toString(), status: "sent" };

    const user = await User.findOne({ _id: req.user.id });
    if (index >= 0 && index < user.emails.length) {
      user.emails.splice(index, 1);
    } else {
      console.log("Invalid index");
      return res.status(400).json({ message: "Invalid index" });
    }
    await User.updateOne(
      { _id: req.user.id },
      { $set: { emails: user.emails } }
    );

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { emails: userEmailUpdate } },
      { new: false }
    );
    res.status(200).json({ message: "email has been sent", email: sendEmail });
  }
});

/**--------------------------------
 * @desc    get specific emails based on status
 * @router  /api/emails/status/:status
 * @method  GET
 * @access  public (only user himself)
----------------------------------*/

module.exports.getEmailBasedStatusCtrl = asyncHandler(async (req, res) => {
  const status = req.params.status;
  let result = [];
  console.log(status);
  let emails = await User.findById(req.user.id, {
    emails: 1,
    _id: 0,
  });
  emails = emails.emails;
  emails = emails.filter((obj) => obj.status === req.params.status);

  for (let k = 0; k < emails.length; k++) {
    let sendData = {
      _id: "",
      from: "",
      to: [],
      subject: "",
      body: "",
      attachment: [],
      createdAt: "",
      updatedAt: "",
      __v: "",
      sentAt: "",
    };
    let emailsBasedStatus = await Email.findById(emails[k]._id).populate([
      "usersData",
      "attachments",
    ]);
    sendData._id = emailsBasedStatus._id;
    sendData.subject = emailsBasedStatus.subject;
    sendData.body = emailsBasedStatus.body;
    sendData.attachment = emailsBasedStatus.attachments;
    sendData.createdAt = emailsBasedStatus.createdAt;
    sendData.updatedAt = emailsBasedStatus.updatedAt;
    sendData.__v = emailsBasedStatus.__v;
    sendData.sentAt = emailsBasedStatus.sentAt;
    sendData.from = await User.findById(emailsBasedStatus.from.toString());
    for (let j = 0; j < emailsBasedStatus.to.length; j++) {
      sendData.to.push(await User.findById(emailsBasedStatus.to[j].toString()));
    }
    result.push(sendData);
  }
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "folder is empty" });
  }
});

/**--------------------------------
 * @desc    download file
 * @router  /api/emails/downloadfile/:filename
 * @method  GET
 * @access  public (only user himself)
----------------------------------*/

module.exports.downloadFileCtrl = asyncHandler(async (req, res) => {
  const fileRef = req.params.filename;
  let destinationFilePath = "";
  console.log(">>", destinationFilePath);
  destinationFilePath = `${fileRef}`;
  console.log(">>", destinationFilePath);

  downloadFile(destinationFilePath, fileRef).then((doc) => {
    const file = doc;
    console.log("mmmmm", file[0]);
    return res.status(200).json({ file: file[0] });
  });

  // try {
  //   console.log("1111111111");
  //   const bucket = admin.storage().bucket();
  //   const file = bucket.file("2024-04-06T02-25-44.024Zlion-66898_1280.jpg"); // Adjust the path as needed
  //   const [fileBuffer] = await file.download();
  //   res.set(
  //     "Content-Disposition",
  //     'attachment; filename="2024-04-06T02-25-44.024Zlion-66898_1280.jpg"'
  //   );
  //   res.set("Content-Type", "image/jpg");
  //   res.send(fileBuffer);
  // } catch (error) {
  //   console.error("Error downloading file:", error);
  //   res.status(500).send("Error downloading file");
  // }

  // res.download();
  // res.download("public/attachment/2024-03-28T18-59-12.846Zth.jpg");
});
