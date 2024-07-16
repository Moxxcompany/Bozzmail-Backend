const express = require('express')
const router = express.Router()
const {
  createNewCustom,
  fetchUserCustoms,
  deleteCustomData,
  editCustomData,
} = require('../controllers/shipments/customController')

router.get("", fetchUserCustoms)
router.post("/:service/create-new", createNewCustom)
router.delete("/:customId/delete", deleteCustomData)
router.post("/:customId/edit", editCustomData)

module.exports = router;