const asyncHandler = require("express-async-handler");
const { Attachment } = require("../models/Attachment");
const { deleteFile } = require("../utils/firebase");

/**--------------------------------
 * @desc    Delete email
 * @router  /api/emails/:id
 * @method  DELETE
 * @access  private (userhimself)
----------------------------------*/

module.exports.deleteAttachmentCtrl = asyncHandler(async (req, res) => {
  let attachment = await Attachment.findByIdAndDelete(req.params.id);
  await deleteFile(attachment.filename).then((result) => {
    if (result) {
      return res.status(200).json({
        message: "attachment has been deleted",
        attachment: attachment,
      });
    } else {
      return res
        .status(404)
        .json({ message: "attachment not found on you not have access" });
    }
  });
});
