const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street1: { type: String },
  street2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
});

const user = new mongoose.Schema({
  email: {
    type: String,
    allowNull: false,
    unique: true,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  is_profile_verified: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  profile_img: {
    type: String
  },
  address: AddressSchema
});
const User = mongoose.model("User", user);
module.exports = User;