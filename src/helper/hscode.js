const Hscode = require("../model/hscode")

const createNewHscode = async (data) => {
  try {
    return await Hscode(data).save()
  } catch (error) {
    throw error
  }
}

const findUserHscode = async (userId, page = 1, limit = 10) => {
  try {
    const query = { userId };

    // Ensure page and limit are valid numbers and greater than zero
    const validPage = page > 0 ? parseInt(page) : 1;
    const validLimit = limit > 0 ? parseInt(limit) : 10;

    // Calculate the number of documents to skip
    const skip = (validPage - 1) * validLimit;

    // Fetch the limited data with pagination
    const hscodeData = await Hscode.find(query).skip(skip).limit(validLimit);

    return hscodeData;
  } catch (error) {
    throw error;
  }
};

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