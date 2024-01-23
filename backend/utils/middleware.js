const jwt = require("jsonwebtoken");

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    success: false,
  });
}

function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    throw new Error("Unauthorized");
  }

  return next();
}

module.exports = {
  isAuthenticated,
  errorHandler,
  notFound,
};
