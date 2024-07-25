const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
  street1: { type: String },
  street2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  is_profile_verified: {
    type: Boolean,
    default: false,
  },
  notify_mobile: {
    type: Boolean,
    default: false,
  },
  notify_email: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  profile_img: {
    type: String,
  },
  telegramId: {
    type: String,
  },
  referral_code: {
    type: String,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  address: AddressSchema,
})
const User = mongoose.model("User", userSchema)
module.exports = User
