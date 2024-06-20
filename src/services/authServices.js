const axios = require('axios');

const sendMobileVerificationCode = async (phoneNumber) => {
  const url = `${process.env.TELNYX_BASEURL}/v2/verifications/sms`;
  const apiKey = process.env.TELNYX_API_KEY;
  const verifyProfileId = process.env.TELNYX_VERIFIED_PROFILE_ID;

  try {
    const response = await axios.post(url, {
      phone_number: phoneNumber,
      verify_profile_id: verifyProfileId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending verification code:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send verification code');
  }
};

module.exports = { sendMobileVerificationCode };
