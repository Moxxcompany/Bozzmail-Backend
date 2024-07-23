const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ShipmentSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  shipmentId: { type: String, required: true },
  shipmentData: { type: Schema.Types.Mixed, required: true },
})

const Shipment = mongoose.model("Shipment", ShipmentSchema)

module.exports = Shipment
