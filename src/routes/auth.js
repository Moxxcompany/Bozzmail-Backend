const express = require('express')
const router = express.Router()
const passport = require('passport');
require('../utils/auth/passport');

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
  resetUserPassword,
  googleLoginSuccess,
  logout,
  sentVerificationEmailCode
} = require('../controllers/auth/authController')

router.use(passport.initialize());
router.use(passport.session());

router.post("/signup", signupSchema, signUp)
router.post("/signin/:action", emailRequired, signIn)
router.post("/send-otp", sendMobileVerificationCode)
router.post("/send-email-otp", emailRequired, sentVerificationEmailCode)
router.post("/forgot-password", emailRequired, sendPasswordLink)
router.post("/reset-password", resetPasswordSchema, resetUserPassword)
router.post("/verify-otp", verifyMobileCode)
router.post("/verify-email", verifyEmailAddress)

//google authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/auth/login/success",
  failureRedirect: "/auth/logout"
}))

router.get("/login/success", googleLoginSuccess)

router.get("/logout", logout)

module.exports = router;