const { createHmac } = require("crypto");
const jwt = require("jsonwebtoken");

function createHash(text) {
  return createHmac("sha256", process.env.SECRET_KEY)
    .update(text)
    .digest("base64");
}

function validatePassword(password, hashedPassword) {
  return createHash(password) === hashedPassword;
}

module.exports = {
  createHash,
  validatePassword,
};
