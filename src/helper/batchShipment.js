const Batch = require("../model/batchShipment")
const { paginate } = require("../utils/filters")

const saveNewBatch = async (data) => {
  try {
    return await Batch(data).save()
  } catch (error) {
    throw error
  }
}

const fetchBatchData = async (userId, page, limit) => {
  try {
    const query = { userId }
    const totalDocuments = await Batch.countDocuments(query)
    if (!limit && !page) {
      return { data: await Batch.find(query), total: totalDocuments }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await Batch.find(query).skip(skip).limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveNewBatch,
  fetchBatchData,
}
