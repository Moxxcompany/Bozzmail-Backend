const express = require('express')
const axios = require('axios');
const router = express.Router()
const { sendMobileVerificationCode } = require('../controllers/authController')

router.post("/send-otp", sendMobileVerificationCode)

module.exports = router;