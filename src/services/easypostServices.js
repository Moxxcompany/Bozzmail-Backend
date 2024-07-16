const { post } = require('../utils/axios')
const {
  EASYPOST_BASE_URL,
  EASYPOST_API_KEY
} = require('../constant/constants')

const generateNewShipment = async (payload) => {
  const url = `${EASYPOST_BASE_URL}/v2/shipments`;
  try {
    const token = `Basic ${Buffer.from(EASYPOST_API_KEY + ':').toString('base64')}`
    const response = await post(url, payload, token);
    return response;
  } catch (error) {
    throw error
  }
};

module.exports = {
  newEasypostShipment: generateNewShipment,
};

