const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
})

const Otp = mongoose.model("Otp", OtpSchema)

module.exports = Otp
