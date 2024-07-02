const { post } = require('../utils/axios')
const {
  INFOBIP_API_KEY,
  INFOBIP_BASE_URL
} = require('../constant/constants')
const INFOBIP_TOKEN = `App ${INFOBIP_API_KEY}`

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
