const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
let dirname = __dirname;

// Split the directory path by the path separator
const parts = dirname.split(path.sep);

// Remove the last part (folder) from the path
parts.pop();

// Join the remaining parts back into a path
dirname = parts.join(path.sep);
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: null,
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    emails: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Email",
        },
        status: {
          type: String,
          enum: ["draft", "inbox", "sent", "starred"],
        },
      },
    ],
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // userSchema.virtual("emailsRef", {
// //   ref: "Email",
// //   foreignField: "from",
// //   // foreignField: "to",
// //   localField: "_id",
// // });
// userSchema.virtual("emailsRef", {
//   ref: "Email",
//   // foreignField: "from",
//   foreignField: "to",
//   localField: "_id",
// });

//generate Auth Token
userSchema.methods.generateAuthToken = function () {
  //this token contain id & isAdmin for user
  const token = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET //{expiresIn:'30d'}
  );
  return token;
};

const User = mongoose.model("User", userSchema);

//validation user register
function VallidationRegister(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}

//validation user login
function VallidationLogin(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}

// validation update user
function validationUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    password: joi.string().trim().min(5),
    bio: joi.string(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  VallidationRegister,
  VallidationLogin,
  validationUpdateUser,
};
