const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user?.username,
      email: user.email,
      roles: user.roles,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

module.exports = {
  generateAccessToken,
};
