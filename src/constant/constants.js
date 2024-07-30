require("dotenv").config()
const constants = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  TELNYX_BASE_URL: process.env.TELNYX_BASE_URL,
  TELNYX_API_KEY: process.env.TELNYX_API_KEY,
  TELNYX_VERIFIED_PROFILE_ID: process.env.TELNYX_VERIFIED_PROFILE_ID,
  TELYNX_SEND_MESSAGE_NUMBER: process.env.TELYNX_SEND_MESSAGE_NUMBER,
  INFOBIP_BASE_URL: process.env.INFOBIP_BASE_URL,
  INFOBIP_API_KEY: process.env.INFOBIP_API_KEY,
  GOSHIPPO_BASE_URL: process.env.GOSHIPPO_BASE_URL,
  GOSHIPPO_API_KEY: process.env.GOSHIPPO_API_KEY,
  FLAVOURCLOUD_BASE_URL: process.env.FLAVOURCLOUD_BASE_URL,
  FLAVOURCLOUD_APP_ID: process.env.FLAVOURCLOUD_APP_ID,
  FLAVOURCLOUD_API_KEY: process.env.FLAVOURCLOUD_API_KEY,
  EASYPOST_BASE_URL: process.env.EASYPOST_BASE_URL,
  EASYPOST_API_KEY: process.env.EASYPOST_API_KEY,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  PASSPORT_SESSION_SECRET: process.env.PASSPORT_SESSION_SECRET,
  NODEMAILER_FROM_EMAIL_ID: process.env.NODEMAILER_FROM_EMAIL_ID,
  NODEMAILER_FROM_EMAIL_PASSWORD: process.env.NODEMAILER_FROM_EMAIL_PASSWORD,
  FE_APP_BASE_URL: process.env.FE_APP_BASE_URL,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  CORS_ORIGIN: "http://localhost:3000",
  PASSWORD_RESET_TOKEN_EXPIRE_TIME: 1, // Token expires in 1 hour
  OTP_EXPIRE_TIME: 10, // OTP expires in 10 minutes
  JWT_TOKEN_EXPIRE_TIME: 3600, //JWT token expires in 1hr
  FLAVOURCLOUD_SERVICE: "flavourcloud",
  EASYPOST_SERVICE: "easypost",
  GOSHIPPO_SERVICE: "goshippo",
  POSTGRID_API_KEY: process.env.POSTGRID_API_KEY,
  POSTGRID_BASE_URL: process.env.POSTGRID_BASE_URL,
  POSTGRID_SECRET_KEY: process.env.POSTGRID_SECRET_KEY,
  SEND_MAIL_LETTER_TYPE: "letter",
  SEND_MAIL_POSTCARD_TYPE: "postcard",
  GOOGLE_ADDRESS_VALIDATION_BASE_URL:
    process.env.GOOGLE_ADDRESS_VALIDATION_BASE_URL,
  GOOGLE_ADDRESS_VALIDATION_KEY: process.env.GOOGLE_ADDRESS_VALIDATION_KEY,
  NEUTRINO_USER_ID: process.env.NEUTRINO_USER_ID,
  NEUTRINO_API_KEY: process.env.NEUTRINO_API_KEY,
  NEUTRINO_BASE_URL: process.env.NEUTRINO_BASE_URL,
  REWARD_POINTS: {
    SIGNUP: {
      message: 'User registered for the first time',
      points: 100
    },
    PURCHASED_SHIPMENT: {
      message: 'User purchased a standard shipment',
      points: 1
    }
  }
}

Object.keys(constants).forEach((key) => {
  if (!constants[key]) {
    throw new Error("Environment variables are not set.")
  }
})

module.exports = constants
