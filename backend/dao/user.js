const User = require("../models/user");

async function findUserByUsername(username) {
  return await User.findOne({ username });
}

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function findUserByUsernameOrEmail(username) {
  return await User.findOne({ $or: [{ email: username }, { username }] });
}

async function findUserById(userId) {
  return await User.findById(userId).select("username email");
}

async function findUsersById(userIds) {
  return await User.find({ _id: { $in: userIds } }).select("username email");
}

async function saveUser(data) {
  const user = new User(data);
  await user.save();
  return user;
}

module.exports = {
  findUserByUsername,
  findUserByEmail,
  findUserByUsernameOrEmail,
  findUserById,
  saveUser,
  findUsersById,
};
