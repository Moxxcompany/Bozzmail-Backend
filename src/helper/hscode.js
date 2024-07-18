const Hscode = require("../model/hscode")

const createNewHscode = async (data) => {
  try {
    return await Hscode(data).save()
  } catch (error) {
    throw error
  }
}

const findUserHscode = async (userId) => {
  try {
    return await Hscode.find({ userId })
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
  deleteHscodeDetail
}