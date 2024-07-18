const ShipmentPurchase = require("../model/shipmentPurchase")
const Shipment = require("../model/shipment")

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

module.exports = {
  saveNewShipment,
  findUserShipments,
  saveNewPurchasedShipment,
  findUserPurchasedShipments
}