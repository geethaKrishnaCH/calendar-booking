const uuid = require("uuid");
const crypto = require("crypto");

function generateTransactionId() {
  return uuid.v4(); // Generates a version 4 UUID
}

function generateOTP(
  length = 6,
  characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
) {
  const possible = characters.split("");
  const bytes = crypto.randomBytes(length);

  const otp = Array.from(bytes)
    .map((byte) => {
      // Convert byte to decimal between 0 and 61
      const dec = byte % 62;
      // Return corresponding character from possible character set
      return possible[dec];
    })
    .join("");

  return otp;
}

module.exports = { generateOTP, generateTransactionId };
