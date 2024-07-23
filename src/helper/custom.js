const Custom = require("../model/customs");
const { paginate } = require("../utils/filters");

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
    const totalDocuments = await Custom.countDocuments(query);
    const { validLimit, skip, validPage} = paginate(page, limit)
    const customsData = await Custom.find(query).skip(skip).limit(validLimit);

    return {
      total: totalDocuments,
      data: customsData,
      page: validPage,
      limit: validLimit
    }
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