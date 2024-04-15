const nodemailer = require("nodemailer");

module.exports = async (
  fromEmail,
  toEmail,
  subject,
  body,
  attachment,
  htmlTemplate
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
    console.log(fromEmail);
    const mailOptions = {
      from: `"My Company" <${fromEmail}>`,
      to: [toEmail],
      subject: subject,
      template: "email",
      text: body,
      attachments: attachment,
      html: htmlTemplate,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
    return info;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (nodemailer)");
  }
};
