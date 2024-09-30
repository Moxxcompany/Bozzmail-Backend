const mongoose = require("mongoose")
const Schema = mongoose.Schema

const WalletFundsSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentStatus: { type: String, required: true },
  transactionId: { type: String },
  amount: { type: String, required: true },
  paymentMode: { type: String },
  transactionalDetails: { type: String }
}, { timestamps: true })

const WalletFunds = mongoose.model(
  "WalletFunds",
  WalletFundsSchema
)

module.exports = WalletFunds