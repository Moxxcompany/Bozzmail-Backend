const mongoose = require('mongoose');
const moment = require('moment');
const Otp = require("../model/otp")

const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  const expiresAt = moment().add(5, 'minutes').toISOString();
  return { otp, expiresAt };
}

const saveOtpDetails = async (email) => {
  const { otp, expiresAt } = generateOtp();
  const otpDoc = await Otp({ email, otp, expiresAt }).save()
  return otpDoc;
}

const fetchOtp = async (email) => {
  const otpData = await Otp.findOne({ email })
  return otpData
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