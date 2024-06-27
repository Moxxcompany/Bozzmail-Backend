const mongoose = require('mongoose');
const PasswordReset = require("../model/passwordReset")

const createPasswordReset = async (data) => {
  const passwordReset = await PasswordReset(data).save()
  return passwordReset
}

const fetchPasswordToken = async (token) => {
  const passwordToken = await PasswordReset.findOne({ token })
  return passwordToken
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