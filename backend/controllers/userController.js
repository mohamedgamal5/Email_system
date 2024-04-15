const asyncHandler = require("express-async-handler");
const { User, validationUpdateUser } = require("../models/User");
const { uploadFile, getUrl, deleteFile } = require("../utils/firebase");
const bcrypt = require("bcryptjs");

/**--------------------------------
 * @desc    get all  user
 * @router  /api/users/getAllUser
 * @method  GET
 * @access  private (only admin)
----------------------------------*/

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  let users = await User.find().select("-password");
  res.status(200).json(users);
});

/**--------------------------------
 * @desc    get single  users
 * @router  /api/users/profile/:id
 * @method  GET
 * @access  public
----------------------------------*/

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "message not found",
    });
  }
  res.status(200).json({ user });
});

/**--------------------------------
 * @desc    update user profile
 * @router  /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
----------------------------------*/

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validationUpdateUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(5);
    req.body.password = await bcrypt.hash(req.body.password, salt, null);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");
  //.populate("posts");
  res.status(200).json({ updateUser });
});

/**--------------------------------
 * @desc    Delete user profile
 * @router  /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or userhimself)
----------------------------------*/

module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  await User.findByIdAndDelete(req.params.id);
  // 8. Send a response to the client
  res.status(200).json({ message: "your profile has been deleted" });
});

/**--------------------------------
 * @desc    Get user count
 * @router  /api/users/count
 * @method  GET
 * @access  private (only admin)
----------------------------------*/

module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  res.status(201).json({ usersCount });
});

/**--------------------------------
 * @desc    profile photo upload
 * @router  /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
----------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1- validation
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  //2- Get the path to the image
  let file = req.file;
  file.originalname =
    new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
  //3- Upload to cloudinary
  await uploadFile(file).then(async () => {
    let url = await getUrl(file.originalname);
    //4- Get the user from DB
    const user = await User.findById(req.user.id);
    //5- Delete old profile photo if exist
    if (user.profilePhoto.publicId !== null) {
      await deleteFile(user.profilePhoto.publicId);
    }
    //6- Change the profilePhoto field in the DB
    user.profilePhoto = {
      url: url,
      publicId: file.originalname,
    };
    await user.save();
    //7- Send response to client
    res.status(200).json({
      message: "your profile photo message uploaded",
      profilePhoto: { url: url, publicId: file.originalname },
    });
  });
});
