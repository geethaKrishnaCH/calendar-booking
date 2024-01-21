const {
  findUserByUsername,
  findUserByEmail,
  saveUser,
  findUserByUsernameOrEmail,
} = require("../dao/user");
const {
  validateInputWithSchema,
} = require("../services/validations/errorHandler");
const {
  hashPassword,
  validatePassword,
  createJWTToken,
} = require("../services/crypt/auth");
const {
  userRegistrationReqSchema,
  loginRequestSchema,
} = require("../services/validations/schemas/user");

async function registerUser(req, res) {
  const data = req.body;
  const value = validateInputWithSchema(data, userRegistrationReqSchema, res);

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
  return res.json({
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
  const value = validateInputWithSchema(data, loginRequestSchema, res);

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
  return res.json({
    data: jwtRes,
    success: true,
  });
}

module.exports = {
  registerUser,
  login,
};
