const express = require('express')
const router = express.Router()
const {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress
} = require('../controllers/authController')

router.post("/send-mobile-otp", sendMobileVerificationCode)
router.post("/verify-mobile-otp", verifyMobileCode)
router.post("/verify-email", verifyEmailAddress)

module.exports = router;