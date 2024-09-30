const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PaymentTracksSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dynoPayPaymentStatus: { type: String, required: true },
  service: { type: String, required: true },
  dynoPayTransactionId: { type: String },
  amount: { type: String, required: true },
  dynoPayPaymentMode: { type: String },
  shipmentPaymentStatus: { type: String, required: true },
  shipmentPurchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "ShipmentPurchase" },
  metaData: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true })

const PaymentTracks = mongoose.model(
  "PaymentTracks",
  PaymentTracksSchema
)

module.exports = PaymentTracks