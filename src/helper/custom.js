const Custom = require("../model/customs")
const { paginate } = require("../utils/filters")

const createNewCustomForm = async (data) => {
  try {
    return await Custom(data).save()
  } catch (error) {
    throw error
  }
}

const findUserCustoms = async (userId, service, page, limit) => {
  try {
    const query = { userId }

    if (service) {
      query.service = service
    }
    const totalDocuments = await Custom.countDocuments(query)
    if (!limit && !page) {
      return { data: await Custom.find(query), total: totalDocuments }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await Custom.find(query).skip(skip).limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

const findCustomDetailsById = async (userId, _id) => {
  try {
    return await Custom.findOne({ userId, _id })
  } catch (error) {
    throw error
  }
}

const deleteCustomDetail = async (userId, _id) => {
  try {
    return await Custom.findOneAndDelete({ userId, _id })
  } catch (error) {
    throw error
  }
}
module.exports = {
  createNewCustomForm,
  findUserCustoms,
  findCustomDetailsById,
  deleteCustomDetail,
}
