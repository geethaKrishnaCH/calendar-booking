const express = require("express");
const { registerUser, login, refreshToken } = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/refreshToken", refreshToken);

module.exports = router;
