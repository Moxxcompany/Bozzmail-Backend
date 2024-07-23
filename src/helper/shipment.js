const ShipmentPurchase = require("../model/shipmentPurchase")
const Shipment = require("../model/shipment")
const ShipmentTracking = require("../model/trackShipment")
const { paginate } = require("../utils/filters")

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
    const query = { userId }
    const totalDocuments = await ShipmentPurchase.countDocuments(query)
    if (!limit && !page) {
      return {
        data: await ShipmentPurchase.find(query),
        total: totalDocuments,
      }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await ShipmentPurchase.find(query)
      .skip(skip)
      .limit(validLimit)
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

const saveShipmentTrackingData = async (data) => {
  try {
    const filter = { userId: data.userId, trackNumber: data.trackNumber }
    const update = data
    const options = { upsert: true, new: true }

    return await ShipmentTracking.findOneAndUpdate(filter, update, options)
  } catch (error) {
    throw error
  }
}

const fetchShipmentPurchaseById = async (shipmentId) => {
  try {
    return await ShipmentPurchase.find({ shipmentId: shipmentId })
  } catch (error) {
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
  fetchShipmentPurchaseById,
}
