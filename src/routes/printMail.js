const express = require('express')
const router = express.Router()
const {
  sendNewPrintMail,
  cancelMail,
  fetchUserPrintMail,
  createWebHook,
  listenWebhookevents
} = require('../controllers/printMail/printMailController')
const { upload } = require('../utils/uploadPic')

router.get("/", fetchUserPrintMail)
router.post("/send/:mailType", upload.single('pdf_data'), sendNewPrintMail)
router.post("/:id/cancel", cancelMail)
router.post("/add-webhook", createWebHook)

module.exports = router;