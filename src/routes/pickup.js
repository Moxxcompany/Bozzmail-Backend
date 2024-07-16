const express = require('express')
const router = express.Router()
const {
  createNewPickup
} = require('../controllers/shipments/pickupController')

router.post("/:service/create-new", createNewPickup)

module.exports = router;