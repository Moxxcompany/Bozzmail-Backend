const User = require("../model/user");
const bcrypt = require("bcrypt");

const fetchUserByEmail = async (email, withPassword) => {
  let userData = {}
  if (withPassword) {
    userData = await User.findOne({ email });
  } else {
    userData = await User.findOne({ email }).select('-password')
  }
  return userData
}

const createNewUser = async (data) => {
  return await User(data).save()
}

const fetchUserById = async (_id, withPassword) => {
  let userData = {}
  if (withPassword) {
    userData = await User.findOne({ _id });
  } else {
    userData = await User.findOne({ _id }).select('-password')
  }
  return userData
}

const getUserData = async (data) => {
  const user = {
    _id: data._id,
    email: data.email,
    phoneNumber: data.phoneNumber,
    is_profile_verified: data.is_profile_verified,
    fullName: data.fullName,
    address: data.address,
    is_active: data.is_active,
    profile_img: data.profile_img
  }
  return user
}

const updateUserPassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(id, { password: hashedPassword })
  return true
}

module.exports = {
  fetchUserByEmail,
  createNewUser,
  fetchUserById,
  getUserData,
  updateUserPassword
}