const express = require('express')
const router = express.Router()
const {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress
} = require('../controllers/authController')

router.post("/send-otp", sendMobileVerificationCode)
router.post("/verify-otp", verifyMobileCode)
router.post("/verify-email", verifyEmailAddress)

module.exports = router;