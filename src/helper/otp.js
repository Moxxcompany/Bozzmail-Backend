const moment = require("moment")
const Otp = require("../model/otp")
const { OTP_EXPIRE_TIME } = require("../constant/constants")

const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString()
  const expiresAt = moment().utc().add(OTP_EXPIRE_TIME, "minutes")
  return { otp, expiresAt }
}

const saveOtpDetails = async (email) => {
  try {
    const { otp, expiresAt } = generateOtp()
    return await Otp({ email, otp, expiresAt }).save()
  } catch (error) {
    throw error
  }
}

const fetchOtp = async (email) => {
  try {
    return await Otp.findOne({ email })
  } catch (error) {
    throw error
  }
}

const updateOtpDetails = async (email) => {
  try {
    const { otp, expiresAt } = generateOtp()
    const data = {
      otp,
      expiresAt,
      email,
    }
    await Otp.updateOne(
      { email },
      {
        otp,
        expiresAt,
      }
    )
    return data
  } catch (error) {
    throw error
  }
}

const verifyEmailOtp = async (email, otp) => {
  try {
    const otpData = await Otp.findOne({ email, otp })
    if (!otpData) {
      return false
    }
    if (moment().utc().isAfter(otpData.expiresAt)) {
      return false
    }
    await Otp.deleteOne({ _id: otpData._id })
    return true
  } catch (error) {
    throw error
  }
}

module.exports = {
  generateOtp,
  saveOtpDetails,
  fetchOtp,
  updateOtpDetails,
  verifyEmailOtp,
}
