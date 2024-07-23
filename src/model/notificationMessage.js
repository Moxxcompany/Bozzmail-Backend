const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NotificationMessageSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
})

const NotificationMessage = mongoose.model(
  "NotificationMessage",
  NotificationMessageSchema
)

module.exports = NotificationMessage
