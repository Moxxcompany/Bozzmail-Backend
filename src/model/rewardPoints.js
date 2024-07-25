const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RewardPointSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  reason: { type: String, required: true },
  recievedAt: { type: Date, default: Date.now}
})

const RewardPoint = mongoose.model("RewardPoint", RewardPointSchema)

module.exports = RewardPoint
