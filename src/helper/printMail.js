const PrintMail = require("../model/printMail")

const savePrintMailData = async (data) => {
  try {
    return await PrintMail(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPrintMailByUserId = async (userId, mailType) => {
  try {
    if (mailType) {
      return await PrintMail.find({ userId, mailType })
    }
    return await PrintMail.find({ userId: userId })
  } catch (error) {
    throw error
  }
}

const fetchPrintMailById = async (_id) => {
  try {
    return await PrintMail.findOne({ _id });
  } catch (error) {

  }
}
module.exports = {
  savePrintMailData,
  fetchPrintMailByUserId,
  fetchPrintMailById
}