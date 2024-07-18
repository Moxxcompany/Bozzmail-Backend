const Pickup = require("../model/pickupModal")

const savePickupData = async (data) => {
  try {
    return await Pickup(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPickUpByUserId = async (userId, service) => {
  try {
    if (service) {
      return await Pickup.find({ userId, service })
    }
    return await Pickup.find({ userId: userId })
  } catch (error) {
    throw error
  }
}
module.exports = {
  savePickupData,
  fetchPickUpByUserId
}