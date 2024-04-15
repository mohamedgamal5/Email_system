const path = require("path");
const multer = require("multer");

// photo upload middleware

const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 10 },
});

const photoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "unsupported file format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = { fileUpload, photoUpload };
