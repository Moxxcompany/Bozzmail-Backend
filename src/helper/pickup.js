const Pickup = require("../model/pickupModal")

const savePickupData = async (data) => {
  try {
    return await Pickup(data).save()
  } catch (error) {
    throw error
  }
}

const fetchPickUpByUserId = async (userId, service, page = 1, limit = 10) => {
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
    const pickupData = await Pickup.find(query).skip(skip).limit(validLimit);

    return pickupData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  savePickupData,
  fetchPickUpByUserId
}