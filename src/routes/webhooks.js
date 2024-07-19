const express = require('express')
const router = express.Router()
const {
  listenWebhookevents
} = require('../controllers/printMail/printMailController')

router.post("/print-mail", express.raw({ type: "application/json" }), listenWebhookevents)

module.exports = router;