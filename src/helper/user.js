const User = require("../model/user")
const bcrypt = require("bcrypt")
const { paginate } = require("../utils/filters")

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

const fetchUserByPhoneNumber = async (phoneNumber) => {
  try {
    return await User.findOne({ phoneNumber }).select("-password")
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
      userData = await User.findOne({ _id }).select("-password -walletId -walletToken")
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
  return await User.findByIdAndUpdate(id, { password: hashedPassword })
}

const findUserByTelegramId = async (id) => {
  try {
    return await User.findOne({ telegramId: id })
  } catch (error) {
    throw error
  }
}

const fetchUsersList = async (limit, page, isActive) => {
  try {
    const query = {}
    if (isActive == 'true') {
      query.is_active = true
    }
    const totalUsers = await User.countDocuments(query)
    if (!limit && !page) {
      return { data: await User.find(query).select("-password").sort({ createdAt: -1 }), total: totalUsers }
    }
    const { validLimit, skip } = paginate(page, limit)
    const data = await User.find(query).select("-password").limit(validLimit).skip(skip).sort({ createdAt: -1 })
    return {
      total: totalUsers,
      data: data,
    }
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
  fetchUserByPhoneNumber,
  fetchUsersList
}
