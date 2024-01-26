const express = require("express");
const {
  registerUser,
  login,
  getOTP,
  verifyOTP,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/otp", getOTP);
router.post("/otp/verify", verifyOTP);
module.exports = router;
