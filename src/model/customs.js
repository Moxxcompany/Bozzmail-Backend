const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomsSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  customId: { type: String, required: true },
  customData: { type: Schema.Types.Mixed, required: true }
});

const Custom = mongoose.model('Custom', CustomsSchema);

module.exports = Custom;