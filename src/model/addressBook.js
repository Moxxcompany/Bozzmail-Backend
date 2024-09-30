const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AddressBookSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  street1: { type: String },
  street2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  addressType: { type: String },
  postalCode: { type: String },
  name: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  is_default: { type: Boolean, default: false },
}, { timestamps: true })

const AddressBook = mongoose.model("AddressBook", AddressBookSchema)

module.exports = AddressBook
