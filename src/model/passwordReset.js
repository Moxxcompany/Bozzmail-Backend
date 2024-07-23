const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PasswordResetSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
})

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema)

module.exports = PasswordReset
