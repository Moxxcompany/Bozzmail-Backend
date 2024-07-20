const express = require('express')
const router = express.Router()
const {
  sendNewPrintMail,
  cancelMail,
  fetchUserPrintMail,
  createWebHook,
  fetchMailById
} = require('../controllers/printMail/printMailController')
const { uploadfile } = require('../utils/uploadFile')

router.get("/", fetchUserPrintMail)
router.get("/:id", fetchMailById)
router.post("/send/:mailType", uploadfile.single('pdf_data'), sendNewPrintMail)
router.post("/:id/cancel", cancelMail)
router.post("/add-webhook", createWebHook)

module.exports = router;