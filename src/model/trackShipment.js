const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ShipmentTrackSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  carrier: { type: String },
  trackNumber: { type: String, required: true },
  ShipmentTrackData: { type: Schema.Types.Mixed, required: true },
})

const ShipmentTracking = mongoose.model("TrackShipment", ShipmentTrackSchema)

module.exports = ShipmentTracking
