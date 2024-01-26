const nodemailer = require("nodemailer");
const emailConfig = require("./emailConfig");

const transporter = nodemailer.createTransport(emailConfig);
const createOTPEmail = (recipient, subject, otp) => {
  return {
    to: recipient,
    subject,
    html: `
        <h3>Welcome to OnTime</h3>
        <p>Please use the OTP: ${otp}</p>
        `,
  };
};

module.exports = {
  transporter,
  createOTPEmail,
};
