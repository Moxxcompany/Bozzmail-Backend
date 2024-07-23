const Batch = require("../model/batchShipment");
const { paginate } = require("../utils/filters");

const saveNewBatch = async (data) => {
  try {
    return await Batch(data).save()
  } catch (error) {
    throw error
  }
}

const fetchBatchData = async (userId, page = 1, limit = 10) => {
  try {
    const query = { userId };
    const totalDocuments = await Batch.countDocuments(query);
    const { validLimit, skip, validPage} = paginate(page, limit)

    const limitedData = await Batch.find(query).skip(skip).limit(validLimit);

    return {
      total: totalDocuments,
      data: limitedData,
      page: validPage,
      limit: validLimit,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveNewBatch,
  fetchBatchData
}