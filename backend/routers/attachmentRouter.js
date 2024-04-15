const express = require("express");
const { deleteAttachmentCtrl } = require("../controllers/attachmentController");

const router = express.Router();

router.delete("/:id", deleteAttachmentCtrl);

module.exports = router;
