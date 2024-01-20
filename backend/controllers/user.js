const User = require("../models/user");
const {
  findUserByUsername,
  findUserByEmail,
  saveUser,
  findUserByUsernameOrEmail,
} = require("../services/user");
const {
  hashPassword,
  validatePassword,
  createJWTToken,
} = require("../utils/crypt/auth");
const {
  userRegistrationReqSchema,
  loginRequestSchema,
} = require("../utils/validations/user");

async function registerUser(req, res) {
  const data = req.body;
  const { value, error } = userRegistrationReqSchema.validate(data);
  if (error) {
    return res.status(400).json({
      message: "Invalid request",
      success: false,
      data: error,
    });
  }

  const { username, email, password } = value;
  let { roles } = value;

  // check if username exists
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return res.status(400).json({
      message: "Username already in use",
      success: false,
    });
  }

  // check if email exists
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({
      message: "Email already in use",
      success: false,
    });
  }

  // hash the password
  const hashedPassword = hashPassword(password);

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
  return res
    .status(200)
    .json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      success: true,
    });
}
async function login(req, res) {
  const data = req.body;

  // validate loginRequest
  const { error, value } = loginRequestSchema.validate(data);
  if (error) {
    return res.status(400).json({
      message: "Invalid request",
      success: false,
      data: error,
    });
  }

  const { username, password } = value;

  // find the user by email or username
  const user = await findUserByUsernameOrEmail(username);
  if (!user) {
    return res.status(400).json({
      message: "User doesn't exist",
      success: false,
    });
  }

  // validate password
  const isValidUser = validatePassword(password, user.password);
  if (!isValidUser) {
    return res.status(401).json({
      message: "Incorrect credentials",
      success: false,
    });
  }

  // generate jwt token
  const jwtRes = createJWTToken({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
  });
  return res.status(200).json({
    data: jwtRes,
    success: true,
  });
}

module.exports = {
  registerUser,
  login,
};
