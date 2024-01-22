const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

function generateRefreshToken(user, jti) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "12h",
    }
  );
}

function generateTokens(user, jti) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
