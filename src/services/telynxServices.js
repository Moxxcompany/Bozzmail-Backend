const { post } = require('../utils/axios')
const telynxBaseUrl = process.env.TELNYX_BASE_URL
const verifyProfileId = process.env.TELNYX_VERIFIED_PROFILE_ID;
const telnyxToken = `Bearer ${process.env.TELNYX_API_KEY}`

const sendMobileVerificationOTP = async (phoneNumber) => {
  const url = `${telynxBaseUrl}/v2/verifications/sms`;
  try {
    const payload = {
      phone_number: phoneNumber,
      verify_profile_id: verifyProfileId,
    }
    const response = await post(url, payload, telnyxToken)
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    const errorStatus = error.response ? error.response.status : 500;
    throw { errors: errorMessage.errors, status: errorStatus };
  }
};

const verifyMobileOTP = async (phoneNumber, otp) => {
  const url = `${telynxBaseUrl}/v2/verifications/by_phone_number/${phoneNumber}/actions/verify`
  try {
    const payload = {
      code: otp,
      verify_profile_id: verifyProfileId,
    }
    const response = await post(url, payload, telnyxToken)
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    const errorStatus = error.response ? error.response.status : 500;
    throw { errors: errorMessage.errors, status: errorStatus };
  }
}

module.exports = { sendMobileVerificationOTP, verifyMobileOTP };
