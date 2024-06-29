const { post } = require('../utils/axios')
const TELNYX_BASE_URL = process.env.TELNYX_BASE_URL
const TELNYX_VERIFIED_PROFILE_ID = process.env.TELNYX_VERIFIED_PROFILE_ID;
const TELNYX_API_KEY = process.env.TELNYX_API_KEY
const TELNYX_TOKEN = `Bearer ${TELNYX_API_KEY}`

if (
  !TELNYX_BASE_URL ||
  !TELNYX_VERIFIED_PROFILE_ID ||
  !TELNYX_API_KEY
) {
  throw new Error('Environment variables for telynx are not set.');
}

const sendSMSVerificationOTP = async (phoneNumber) => {
  const url = `${TELNYX_BASE_URL}/v2/verifications/sms`;
  try {
    const payload = {
      phone_number: phoneNumber,
      verify_profile_id: TELNYX_VERIFIED_PROFILE_ID,
    }
    const response = await post(url, payload, TELNYX_TOKEN)
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    const errorStatus = error.response ? error.response.status : 500;
    throw { errors: errorMessage.errors, status: errorStatus };
  }
};

const verifySMSOTP = async (phoneNumber, otp) => {
  const url = `${TELNYX_BASE_URL}/v2/verifications/by_phone_number/${phoneNumber}/actions/verify`
  try {
    const payload = {
      code: otp,
      verify_profile_id: TELNYX_VERIFIED_PROFILE_ID,
    }
    const response = await post(url, payload, TELNYX_TOKEN)
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    const errorStatus = error.response ? error.response.status : 500;
    throw { errors: errorMessage.errors, status: errorStatus };
  }
}

module.exports = { sendSMSVerificationOTP, verifySMSOTP };
