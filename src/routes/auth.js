const express = require('express')
const router = express.Router()
const { 
  signupSchema,
  signInSchema
} = require('../validation/user')
const {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress,
  signUp,
  signIn
} = require('../controllers/authController')

router.post("/signup", signupSchema, signUp)
router.post("/signin/:action", signInSchema, signIn)
router.post("/send-otp", sendMobileVerificationCode)
router.post("/verify-otp", verifyMobileCode)
router.post("/verify-email", verifyEmailAddress)

module.exports = router;