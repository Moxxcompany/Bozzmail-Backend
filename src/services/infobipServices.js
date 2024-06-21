const { post } = require('../utils/axios')
const infobipBaseUrl = process.env.INFOBIP_BASEURL
const infobipToken = `App ${process.env.INFOBIP_API_KEY}`

const verifyEmailId = async (emailId) => {
  const url = `${infobipBaseUrl}/email/2/validation`;
  try {
    const payload = {
      to: emailId
    }
    const response = await post(url, JSON.stringify(payload), infobipToken)
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyEmailId };
