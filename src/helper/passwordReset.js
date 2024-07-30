const mongoose = require("mongoose")
const PasswordReset = require("../model/passwordReset")

const createPasswordReset = async (data) => {
  try {
    return await PasswordReset(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPasswordToken = async (token) => {
  try {
    return await PasswordReset.findOne({ token })
  } catch (error) {
    throw error
  }
}

const deleteToken = async (_id) => {
  try {
    return await PasswordReset.deleteOne({ _id })
  } catch (error) {
    throw error
  }
}

const fetchTokenByUserId = async (userId) => {
  try {
    return await PasswordReset.findOne({ userId })
  } catch (error) {
    throw error
  }
}

module.exports = {
  createPasswordReset,
  fetchPasswordToken,
  deleteToken,
  fetchTokenByUserId
}
