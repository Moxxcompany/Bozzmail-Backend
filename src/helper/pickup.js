const Pickup = require("../model/pickupModal")
const { paginate } = require("../utils/filters")

const savePickupData = async (data) => {
  try {
    return await Pickup(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPickUpByUserId = async (userId, service, page, limit) => {
  try {
    const query = { userId }
    if (service) {
      query.service = service
    }
    const totalDocuments = await Pickup.countDocuments(query)
    if (!limit && !page) {
      return { data: await Pickup.find(query), total: totalDocuments }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await Pickup.find(query).skip(skip).limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  savePickupData,
  fetchPickUpByUserId,
}
