const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ShipmentPurchaseSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  shipmentId: { type: String, required: true },
  shipmentData: { type: Schema.Types.Mixed, required: true },
})

const ShipmentPurchase = mongoose.model(
  "ShipmentPurchase",
  ShipmentPurchaseSchema
)

module.exports = ShipmentPurchase
