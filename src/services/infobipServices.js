const { post } = require('../utils/axios')
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY
const INFOBIP_TOKEN = `App ${INFOBIP_API_KEY}`

if (
  !INFOBIP_BASE_URL ||
  !INFOBIP_API_KEY 
) {
  throw new Error('Environment variables for infobip are not set.');
}


const verifyEmailId = async (emailId) => {
  const url = `${INFOBIP_BASE_URL}/email/2/validation`;
  try {
    const payload = {
      to: emailId
    }
    const response = await post(url, JSON.stringify(payload), INFOBIP_TOKEN)
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyEmailId };
