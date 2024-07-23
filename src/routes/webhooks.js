const express = require('express')
const router = express.Router()
const {
  postGridWebhook
} = require('../controllers/printMail/printMailController')

router.post("/print-mail", express.raw({ type: "application/json" }), postGridWebhook)

module.exports = router;