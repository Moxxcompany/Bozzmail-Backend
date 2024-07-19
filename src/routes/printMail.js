const express = require('express')
const router = express.Router()
const {
  sendNewPrintMail,
  cancelMail,
  fetchUserPrintMail,
  createWebHook
} = require('../controllers/printMail/printMailController')
const { uploadfile } = require('../utils/uploadFile')

router.get("/", fetchUserPrintMail)
router.post("/send/:mailType", uploadfile.single('pdf_data'), sendNewPrintMail)
router.post("/:id/cancel", cancelMail)
router.post("/add-webhook", createWebHook)

module.exports = router;