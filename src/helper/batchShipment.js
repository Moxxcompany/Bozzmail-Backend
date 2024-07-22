const Batch = require("../model/batchShipment")

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

    const validPage = page > 0 ? parseInt(page) : 1;
    const validLimit = limit > 0 ? parseInt(limit) : 10;
    const skip = (validPage - 1) * validLimit;

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