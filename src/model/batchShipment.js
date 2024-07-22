const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BatchSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  batchId: { type: String, required: true },
  batchData: { type: Schema.Types.Mixed, required: true }
});

const Batch = mongoose.model('Batch', BatchSchema);

module.exports = Batch;