const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cardholderName: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
