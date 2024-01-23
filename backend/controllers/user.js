const {
  findUserByUsername,
  findUserByEmail,
  saveUser,
  findUserByUsernameOrEmail,
} = require("../dao/user");
const { validateInputWithSchema } = require("../utils/errorHandler");
const { createHash, validatePassword } = require("../services/crypt/hash");
const {
  userRegistrationReqSchema,
  loginRequestSchema,
} = require("../services/validations/schemas/user");
const { generateAccessToken } = require("../services/crypt/jwt");
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
    const accessToken = generateAccessToken(user);
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

    const accessToken = generateAccessToken(user);
    return res.json({
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
};
