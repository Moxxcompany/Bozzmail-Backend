const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HscodeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  hscodeDetails: { type: Schema.Types.Mixed, required: true }
});

const Hscode = mongoose.model('HScode', HscodeSchema);

module.exports = Hscode;