const Custom = require("../model/customs")

const createNewCustomForm = async (data) => {
  try {
    return await Custom(data).save()
  } catch (error) {
    throw error
  }
}

const findUserCustoms = async (userId, service, page = 1, limit = 10) => {
  try {
    const query = { userId };

    if (service) {
      query.service = service;
    }

    // Ensure page and limit are valid numbers and greater than zero
    const validPage = page > 0 ? parseInt(page) : 1;
    const validLimit = limit > 0 ? parseInt(limit) : 10;

    // Calculate the number of documents to skip
    const skip = (validPage - 1) * validLimit;

    // Fetch the limited data with pagination
    const customsData = await Custom.find(query).skip(skip).limit(validLimit);

    return customsData;
  } catch (error) {
    throw error;
  }
};

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