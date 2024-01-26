const Otp = require("../models/otp");

async function saveOTP(data) {
  const otp = new Otp(data);
  await otp.save();
}

async function findByTransaction(transactionId) {
  return await Otp.findOne({ transactionId });
}

module.exports = {
  saveOTP,
  findByTransaction,
};
