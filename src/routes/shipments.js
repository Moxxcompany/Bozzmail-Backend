const express = require('express')
const router = express.Router()
const {
  createNewLabel,
  fetchShipmentRates,
  purchaseShipment
} = require('../controllers/shipments/shipmentController')

router.post("/:service/create-new", createNewLabel)
router.post("/:service/get-rates", fetchShipmentRates)
router.post("/:service/purchase", purchaseShipment)

module.exports = router;