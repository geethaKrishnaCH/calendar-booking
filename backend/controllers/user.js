const {
  findUserByUsername,
  findUserByEmail,
  saveUser,
  findUserByUsernameOrEmail,
} = require("../dao/user");
const {
  validateInputWithSchema,
} = require("../services/validations/errorHandler");
const { createHash, validatePassword } = require("../services/crypt/hash");
const {
  userRegistrationReqSchema,
  loginRequestSchema,
} = require("../services/validations/schemas/user");
const {
  generateTokens,
  generateAccessToken,
} = require("../services/crypt/jwt");
const { v4: uuidv4 } = require("uuid");
const setRefreshToken = require("../utils/setRefreshToken");
const jwt = require("jsonwebtoken");

async function registerUser(req, res, next) {
  try {
    const data = req.body;
    const value = validateInputWithSchema(data, userRegistrationReqSchema, res);

    const { username, email, password } = value;
    let { roles } = value;

    // check if username exists
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      res.status(400);
      throw new Error("Username already in use");
    }

    // check if email exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      res.status(400);
      throw new Error("Email already in use");
    }

    // hash the password
    const hashedPassword = createHash(password);

    // add default roles
    if (!roles || roles.length === 0) {
      roles = ["USER"];
    }

    if (roles && !roles.includes("USER")) {
      roles.push("USER");
    }

    // create a new user
    let user = {
      username,
      email,
      password: hashedPassword,
      roles,
    };
    // save the user
    user = await saveUser(user);

    // generate unique uid to prevent replay attacks
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    setRefreshToken(res, refreshToken);
    return res.json({
      data: { accessToken },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
async function login(req, res, next) {
  try {
    const data = req.body;

    // validate loginRequest
    const value = validateInputWithSchema(data, loginRequestSchema, res);

    const { username, password } = value;

    // find the user by email or username
    const user = await findUserByUsernameOrEmail(username);
    if (!user) {
      res.status(403);
      throw new Error("User doesn't exist");
    }

    // validate password
    const isValidUser = validatePassword(password, user.password);
    if (!isValidUser) {
      res.status(403);
      throw new Error("Incorrect credentials");
    }

    const jti = uuidv4();
    // generate jwt token
    const { accessToken, refreshToken } = generateTokens(user, jti);
    setRefreshToken(res, refreshToken);
    return res.json({
      data: { accessToken },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token.");
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await findUserByEmail(payload.email);
    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const jti = uuidv4();
    const accessToken = generateAccessToken(user);

    // setRefreshToken(res, newRefreshToken);
    res.json({
      data: { accessToken },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
  login,
  refreshToken,
};
