const express = require('express')
const router = express.Router()
const {
  createNewLabel,
  fetchShipmentRates,
  purchaseShipment,
  getUserShipments,
  trackShipment,
  getShipmentsById
} = require('../controllers/shipments/shipmentController')

router.post("/:service/create-new", createNewLabel)
router.post("/:service/get-rates", fetchShipmentRates)
router.post("/:service/purchase", purchaseShipment)
router.post("/:service/trackShipment", trackShipment)
router.get("/:service/trackShipment/:trackNumber", trackShipment)
router.get("/getUserShippment", getUserShipments)
router.get("/getShipment/:shipmentId", getShipmentsById);
module.exports = router;