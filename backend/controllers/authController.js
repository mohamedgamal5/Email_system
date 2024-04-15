const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const {
  User,
  VallidationRegister,
  VallidationLogin,
} = require("../models/User");

/**--------------------------------
 * @desc    Register new user
 * @router  /api/auth/register
 * @method  POST
 * @access  public
----------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = VallidationRegister(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exist" });
  }

  const salt = await bcrypt.genSalt(5);
  const hashPassword = await bcrypt.hash(req.body.password, salt, null);
  // new user
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });

  await user.save();
  return res.status(200).json({ message: "register successfully" });
});

/**--------------------------------
 * @desc    login  user
 * @router  /api/auth/login
 * @method  POST
 * @access  public
----------------------------------*/

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = VallidationLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  // generate token

  const token = user.generateAuthToken();
  // response to client
  res.status(200).json({
    _id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token: "Bearer " + token,
  });
});
