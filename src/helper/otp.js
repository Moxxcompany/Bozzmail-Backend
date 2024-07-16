const moment = require('moment');
const Otp = require("../model/otp")
const {
  OTP_EXPIRE_TIME
} = require('../constant/constants')

const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  const expiresAt = moment().add(OTP_EXPIRE_TIME, 'minutes').toISOString();
  return { otp, expiresAt };
}

const saveOtpDetails = async (email) => {
  const { otp, expiresAt } = generateOtp();
  return await Otp({ email, otp, expiresAt }).save()
}

const fetchOtp = async (email) => {
  return await Otp.findOne({ email })
}

const updateOtpDetails = async (email) => {
  const { otp, expiresAt } = generateOtp();
  const data = {
    otp,
    expiresAt,
    email
  }
  await Otp.updateOne(
    { email },
    {
      otp,
      expiresAt
    }
  );
  return data
}

const verifyEmailOtp = async (email, otp) => {
  const otpData = await Otp.findOne({ email, otp })
  if (!otpData) {
    return false;
  }
  if (moment().isAfter(otpData.expiresAt)) {
    return false
  }

  await Otp.deleteOne({ _id: otpDoc._id });
  return true
}

module.exports = {
  generateOtp,
  saveOtpDetails,
  fetchOtp,
  updateOtpDetails,
  verifyEmailOtp
}