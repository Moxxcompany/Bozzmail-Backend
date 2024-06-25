const mongoose = require("mongoose");
const user = new mongoose.Schema({
  email: {
    type: String,
    allowNull: false,
    unique: true,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  is_profile_verified: {
    type: Boolean,
    default: false
  }
});
const User = mongoose.model("User", user);
module.exports = User;