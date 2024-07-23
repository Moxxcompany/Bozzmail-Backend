const express = require("express")
const router = express.Router()
const {
  createNewPickup,
  getPickup,
} = require("../controllers/shipments/pickupController")

router.post("/:service/create-new", createNewPickup)
router.get("/getPickup", getPickup)

module.exports = router
