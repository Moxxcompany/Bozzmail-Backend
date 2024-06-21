const { post } = require('../utils/axios')
const baseUrl = process.env.EASYPOST_BASE_URL
const apiKey = process.env.EASYPOST_API_KEY

const generateNewShipment = async (payload) => {
  const url = `${baseUrl}/v2/shipments`;
  try {
    const token = `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
    const response = await post(url, payload, token);
    return response;
  } catch (error) {
    throw error
  }
};

module.exports = {
  newEasypostShipment: generateNewShipment,
};

