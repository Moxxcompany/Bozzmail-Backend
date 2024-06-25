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

const getUserData = async (data) => {
  const user = {
    id: data._id,
    email: data.email,
    phoneNumber: data.phoneNumber,
    is_profile_verified: data.is_profile_verified
  }
  return user
}

module.exports = {
  fetchUserByEmail,
  createNewUser,
  getUserData
}