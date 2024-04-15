const express = require("express");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createEmailCtrl,
  getAllEmailsCtrl,
  getEmailCtrl,
  deleteEmailCtrl,
  sendEmailInternalCtrl,
  sendEmailCtrl,
  updateEmailCtrl,
  getEmailBasedStatusCtrl,
  downloadFileCtrl,
  sendEmailByGmailCtrl,
} = require("../controllers/emailController");
const { fileUpload } = require("../middlewares/fileUpload");
const validateEmailStatus = require("../middlewares/validateEmailStatus");

const router = express.Router();

router
  .route("/create")
  .post(verifyToken, fileUpload.array("attachment", 5), createEmailCtrl);

router.route("/getAllEmails").get(verifyToken, getAllEmailsCtrl);

router
  .route("/:id")
  .get(validateObjectId, verifyToken, getEmailCtrl)
  .delete(validateObjectId, verifyToken, deleteEmailCtrl)
  .put(
    validateObjectId,
    verifyToken,
    fileUpload.array("attachment", 5),
    updateEmailCtrl
  );

router
  .route("/status/:status")
  .get(validateEmailStatus, verifyToken, getEmailBasedStatusCtrl);

router.route("/downloadfile/:filename").get(verifyToken, downloadFileCtrl);

router
  .route("/send-internal")
  .post(verifyToken, fileUpload.array("attachment", 5), sendEmailCtrl);

router
  .route("/send-internal/:id")
  .put(validateObjectId, verifyToken, sendEmailInternalCtrl);

router
  .route("/send/:id")
  .put(validateObjectId, verifyToken, sendEmailByGmailCtrl);

module.exports = router;
