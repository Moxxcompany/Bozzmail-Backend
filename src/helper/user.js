const User = require("../model/user");

const fetchUserByEmail = async (email) => {
  const userData = await User.findOne({ email });
  return userData
}

const createNewUser = async (data) => {
  const newUser = new User(data)
  const userData = await newUser.save()
  return userData
}

module.exports = {
  fetchUserByEmail,
  createNewUser
}