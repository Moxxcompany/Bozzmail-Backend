const PrintMail = require("../model/printMail")

const savePrintMailData = async (data) => {
  try {
    return await PrintMail(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPrintMailByUserId = async (userId, mailType, limit, page) => {
  try {
    const query = {}
    query.userId = userId
    if (mailType) {
      query.mailType = mailType
    }
    if (!limit && !page) {
      return await PrintMail.find(query)
    }
    const validLimit = limit > 0 ? parseInt(limit) : 10;
    const validPage = page > 0 ? parseInt(page) : 1;
    return await PrintMail.find(query)
      .limit(validLimit)
      .skip((validPage - 1) * validLimit)
  } catch (error) {
    throw error
  }
}

const fetchPrintMailById = async (_id) => {
  try {
    return await PrintMail.findOne({ _id });
  } catch (error) {
    throw error
  }
}
module.exports = {
  savePrintMailData,
  fetchPrintMailByUserId,
  fetchPrintMailById
}