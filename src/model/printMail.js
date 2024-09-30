const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PrintMailSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mailType: { type: String, required: true },
  mailId: { type: String, required: true },
  mailData: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true })

const PrintMail = mongoose.model("PrintMail", PrintMailSchema)

module.exports = PrintMail
