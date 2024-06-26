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
  await PasswordReset.findByIdAndRemove(_id)
  return true
}

module.exports = {
  createPasswordReset,
  fetchPasswordToken,
  deleteToken
}