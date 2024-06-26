const express = require('express')
const router = express.Router()
const {
  signupSchema,
  emailRequired,
  resetPasswordSchema
} = require('../validation/user')
const {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress,
  signUp,
  signIn,
  sendPasswordLink,
  resetUserPassword
} = require('../controllers/authController')

router.post("/signup", signupSchema, signUp)
router.post("/signin/:action", emailRequired, signIn)
router.post("/send-otp", sendMobileVerificationCode)
router.post("/forgot-password", emailRequired, sendPasswordLink)
router.post("/reset-password", resetPasswordSchema, resetUserPassword)
router.post("/verify-otp", verifyMobileCode)
router.post("/verify-email", verifyEmailAddress)

module.exports = router;