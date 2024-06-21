const express = require('express')
const router = express.Router()
const {
  createNewShipment
} = require('../controllers/shipmentsController')

router.post("/:service/create-new", createNewShipment)

module.exports = router;