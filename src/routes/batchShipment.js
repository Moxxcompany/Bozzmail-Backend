const express = require('express')
const router = express.Router()
const {
  createNewBatch,
  getUserBatches
} = require('../controllers/shipments/batchController')

router.post("/:service/create-new", createNewBatch)
router.get("", getUserBatches)
// router.post("/:service/get-rates", fetchShipmentRates)
// router.post("/:service/purchase", purchaseShipment)
// router.post("/:service/trackShipment", trackShipment)
// router.get("/:service/trackShipment/:trackNumber", trackShipment)
// router.get("/getUserShippment", getUserShipments)
// router.get("/getShipment/:shipmentId", getShipmentsById);
module.exports = router;