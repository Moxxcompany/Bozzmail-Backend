const PaymentTracks = require("../model/paymentTracks")

const saveNewPaymentTracks = async (data) => {
  try {
    return await PaymentTracks(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPaymentTrackById = async (_id) => {
  try {
    return await PaymentTracks.findOne({ _id })
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveNewPaymentTracks,
  fetchPaymentTrackById
}