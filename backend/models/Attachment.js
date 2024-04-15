const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const attachmmentSchema = mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
      required: true,
    },
    filename: {
      type: String,
    },
    url: { type: String },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);
const Attachment = mongoose.model("Attachment", attachmmentSchema);

module.exports = { Attachment };
