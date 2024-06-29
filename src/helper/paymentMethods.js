const PaymentMethod = require("../model/paymentMethods");

const fetchUserPaymentMethods = async (userId) => {
  return await PaymentMethod.find({ userId });
}

const createUserNewPaymentMethod = async (data) => {
  return await PaymentMethod(data).save()
}

const getPaymentMethodById = async (_id, userId) => {
  return await PaymentMethod.findOne({ _id, userId })
}

module.exports = {
  fetchUserPaymentMethods,
  createUserNewPaymentMethod,
  getPaymentMethodById
}