const PrintMail = require("../model/printMail")
const { paginate } = require("../utils/filters")

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
    const totalDocuments = await PrintMail.countDocuments(query)
    if (!limit && !page) {
      return { data: await PrintMail.find(query), total: totalDocuments }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await PrintMail.find(query).skip(skip).limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

const fetchPrintMailById = async (_id) => {
  try {
    return await PrintMail.findOne({ _id })
  } catch (error) {
    throw error
  }
}

const fetchPrintMailByMailId = async (mailId) => {
  try {
    return await PrintMail.findOne({ mailId })
  } catch (error) {
    throw error
  }
}

module.exports = {
  savePrintMailData,
  fetchPrintMailByUserId,
  fetchPrintMailById,
  fetchPrintMailByMailId,
}
