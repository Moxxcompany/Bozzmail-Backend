const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PickupSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  pickupId: { type: String, required: true },
  PickupData: { type: Schema.Types.Mixed, required: true }
});

const Pickup = mongoose.model('Pickup', PickupSchema);

module.exports = Pickup;