const { post } = require('../utils/axios')
const EASYPOST_BASE_URL = process.env.EASYPOST_BASE_URL
const EASYPOST_API_KEY = process.env.EASYPOST_API_KEY

if (
  !EASYPOST_BASE_URL ||
  !EASYPOST_API_KEY
) {
  throw new Error('Environment variables for easypost are not set.');
}

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

