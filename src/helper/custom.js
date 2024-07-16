const Custom = require("../model/customs")

const createNewCustomForm = async (data) => {
  try {
    return await Custom(data).save()
  } catch (error) {
    throw error
  }
}

const findUserCustoms = async (userId, service) => {
  try {
    if (service) {
      return await Custom.find({ userId, service })
    }
    return await Custom.find({ userId: userId })
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
  deleteCustomDetail
}