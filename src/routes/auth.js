const express = require('express')
const router = express.Router()
const passport = require('passport');
require('../utils/auth/passport');

const {
  signupValidations,
  emailRequired,
  resetPasswordValidations,
  telegramSignUpValidations
} = require('../validation/user')
const {
  sendSMSVerificationCode,
  verifySMSCode,
  verifyEmailAddress,
  signUp,
  signIn,
  sendResetPasswordLink,
  resetUserPassword,
  googleLoginSuccess,
  logout,
  sentVerificationEmailCode,
  telegramLoginSuccess
} = require('../controllers/auth/authController')

router.use(passport.initialize());
router.use(passport.session());

router.post("/signup", signupValidations, signUp)
router.post("/signin/:action", emailRequired, signIn)
router.post("/send-otp", sendSMSVerificationCode)
router.post("/send-email-otp", emailRequired, sentVerificationEmailCode)
router.post("/forgot-password", emailRequired, sendResetPasswordLink)
router.post("/reset-password", resetPasswordValidations, resetUserPassword)
router.post("/verify-otp", verifySMSCode)
router.post("/verify-email", verifyEmailAddress)
router.post("/telegram/callback", telegramSignUpValidations, telegramLoginSuccess)

//google authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/auth/login/success",
  failureRedirect: "/auth/logout"
}))

router.get("/login/success", googleLoginSuccess)

router.get("/logout", logout)

module.exports = router;