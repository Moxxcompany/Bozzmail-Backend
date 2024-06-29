const mongoose = require('mongoose');
const PasswordReset = require("../model/passwordReset")

const createPasswordReset = async (data) => {
  return await PasswordReset(data).save()
}

const fetchPasswordToken = async (token) => {
  return await PasswordReset.findOne({ token })
}

const deleteToken = async (_id) => {
  const objectId = mongoose.Types.ObjectId(_id);
  await PasswordReset.findByIdAndRemove(objectId)
  return true
}

module.exports = {
  createPasswordReset,
  fetchPasswordToken,
  deleteToken
}