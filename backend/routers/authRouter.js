const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUserCtrl);
router.post("/login", loginUserCtrl);

module.exports = router;
