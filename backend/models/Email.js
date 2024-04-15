const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const emailSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subject: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    // attachment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
emailSchema.virtual("usersData", {
  ref: "User",
  foreignField: "emails._id",
  localField: "_id",
});
emailSchema.virtual("attachments", {
  ref: "Attachment",
  foreignField: "email",
  localField: "_id",
});
const Email = mongoose.model("Email", emailSchema);

function validationCreateEmail(obj) {
  const schema = joi.object({
    emails: joi.array().items(joi.string().email()),
    subject: joi.string().trim(),
    body: joi.string().trim(),
  });
  return schema.validate(obj);
}

// validation update email
function validationUpdateEmail(obj) {
  const schema = joi.object({
    emails: joi.array().items(joi.string().email()),
    subject: joi.string().trim(),
    body: joi.string().trim(),
  });
  return schema.validate(obj);
}

module.exports = { Email, validationCreateEmail, validationUpdateEmail };
