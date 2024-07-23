const User = require("../model/user")
const bcrypt = require("bcrypt")

const fetchUserByEmail = async (email, withPassword) => {
  try {
    let userData = {}
    if (withPassword) {
      userData = await User.findOne({ email })
    } else {
      userData = await User.findOne({ email }).select("-password")
    }
    return userData
  } catch (error) {
    throw error
  }
}

const createNewUser = async (data) => {
  try {
    return await User(data).save()
  } catch (error) {
    throw error
  }
}

const fetchUserById = async (_id, withPassword) => {
  try {
    let userData = {}
    if (withPassword) {
      userData = await User.findOne({ _id })
    } else {
      userData = await User.findOne({ _id }).select("-password")
    }
    return userData
  } catch (error) {
    throw error
  }
}

const getUserData = async (data) => {
  try {
    const { password, ...user } = data._doc
    return user
  } catch (error) {
    throw error
  }
}

const updateUserPassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  await User.findByIdAndUpdate(id, { password: hashedPassword })
  return true
}

const findUserByTelegramId = async (id) => {
  try {
    return await User.findOne({ telegramId: id })
  } catch (error) {
    throw error
  }
}

module.exports = {
  fetchUserByEmail,
  createNewUser,
  fetchUserById,
  getUserData,
  updateUserPassword,
  findUserByTelegramId,
}
