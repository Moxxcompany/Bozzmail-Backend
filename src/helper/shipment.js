const ShipmentPurchase = require("../model/shipmentPurchase")
const Shipment = require("../model/shipment")
const ShipmentTracking = require("../model/trackShipment")

const saveNewShipment = async (data) => {
  try {
    return await Shipment(data).save()
  } catch (error) {
    throw error
  }
}

const findUserShipments = async (userId) => {
  try {
    return await Shipment.find({ userId: userId })
  } catch (error) {
    throw error
  }
}

const saveNewPurchasedShipment = async (data) => {
  try {
    return await ShipmentPurchase(data).save()
  } catch (error) {
    throw error
  }
}

const findUserPurchasedShipments = async (userId) => {
  try {
    return await ShipmentPurchase.find({ userId: userId })
  } catch (error) {
    throw error
  }
}

const fetchShipmentData = async (userId, page = 1, limit = 10) => {
  try {
    const query = { userId };
    const totalDocuments = await ShipmentPurchase.countDocuments(query);

    // Ensure page and limit are valid numbers and greater than zero
    const validPage = page > 0 ? parseInt(page) : 1;
    const validLimit = limit > 0 ? parseInt(limit) : 10;

    // Calculate the number of documents to skip
    const skip = (validPage - 1) * validLimit;

    // Fetch the limited data with pagination
    const limitedData = await ShipmentPurchase.find(query).skip(skip).limit(validLimit);

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

const saveShipmentTrackingData = async (data) => {
  try {
    const filter = { userId: data.userId, trackNumber: data.trackNumber };
    const update = data;
    const options = { upsert: true, new: true };

    return await ShipmentTracking.findOneAndUpdate(filter, update, options);
  } catch (error) {
    throw error;
  }
};


const fetchShipmentPurchaseById = async (shipmentId) => {
  try{
    return await ShipmentPurchase.find({shipmentId : shipmentId })
  }catch(error){
    throw error
  }
}
module.exports = {
  saveNewShipment,
  findUserShipments,
  saveNewPurchasedShipment,
  findUserPurchasedShipments,
  fetchShipmentData,
  saveShipmentTrackingData,
  fetchShipmentPurchaseById
}