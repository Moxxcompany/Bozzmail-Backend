const express = require('express')
const router = express.Router()
const {
  generateNewHscode,
  fetchUserHscode,
  deleteHscodeData,
  editHscodeData
} = require('../controllers/shipments/hscodeController')

router.get("", fetchUserHscode)
router.post("", generateNewHscode)
router.delete("/:hscodeId/delete", deleteHscodeData)
router.post("/:hscodeId/edit", editHscodeData)

module.exports = router;