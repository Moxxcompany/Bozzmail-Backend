const Hscode = require("../model/hscode")
const { paginate } = require("../utils/filters")

const createNewHscode = async (data) => {
  try {
    return await Hscode(data).save()
  } catch (error) {
    throw error
  }
}

const findUserHscode = async (userId, page, limit) => {
  try {
    const query = { userId }
    const totalDocuments = await Hscode.countDocuments(query)
    if (!limit && !page) {
      return { data: await Hscode.find(query), total: totalDocuments }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await Hscode.find(query).skip(skip).limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

const findHscodeDetailsById = async (userId, _id) => {
  try {
    return await Hscode.findOne({ userId, _id })
  } catch (error) {
    throw error
  }
}

const deleteHscodeDetail = async (userId, _id) => {
  try {
    return await Hscode.findOneAndDelete({ userId, _id })
  } catch (error) {
    throw error
  }
}
module.exports = {
  createNewHscode,
  findUserHscode,
  findHscodeDetailsById,
  deleteHscodeDetail,
}
