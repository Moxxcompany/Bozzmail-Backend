const express = require("express")
const router = express.Router()
const {
  createNewBatch,
  getUserBatches,
} = require("../controllers/shipments/batchController")

router.post("/:service/create-new", createNewBatch)
router.get("", getUserBatches)

module.exports = router
