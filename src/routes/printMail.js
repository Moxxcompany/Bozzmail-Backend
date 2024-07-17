const express = require('express')
const router = express.Router()
const {
  sendNewPrintMail,
  cancelMail,
  fetchUserPrintMail,
  createWebHook,
  listenWebhookevents
} = require('../controllers/printMail/printMailController')

router.get("/", fetchUserPrintMail)
router.post("/send/:mailType", sendNewPrintMail)
router.post("/:id/cancel", cancelMail)
router.post("/add-webhook", createWebHook)
router.post("/webhooks", listenWebhookevents)

module.exports = router;