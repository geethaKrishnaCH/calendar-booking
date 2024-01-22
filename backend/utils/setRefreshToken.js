function setRefreshToken(res, token) {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    sameSite: true,
    path: "api/user",
  });
}

module.exports = setRefreshToken;
