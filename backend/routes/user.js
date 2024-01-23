const express = require("express");
const {
  registerUser,
  login,
  refreshToken,
  logout,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.get("/logout", logout);

module.exports = router;
