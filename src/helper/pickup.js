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
        const userData = await Pickup.findOne({ userId: userId, service: service });
        return userData
    } catch (error) {
      throw error
    }
  }
module.exports = {
    savePickupData,
    fetchPickUpByUserId
}