const { post } = require('../utils/axios')
const FLAVOURCLOUD_BASE_URL = process.env.FLAVOURCLOUD_BASE_URL
const FLAVOURCLOUD_APP_ID = process.env.FLAVOURCLOUD_APP_ID
const FLAVOURCLOUD_API_KEY = process.env.FLAVOURCLOUD_API_KEY

if (
  !FLAVOURCLOUD_BASE_URL ||
  !FLAVOURCLOUD_APP_ID ||
  !FLAVOURCLOUD_API_KEY
) {
  throw new Error('Environment variables for flavourcloud are not set.');
}

const generateNewShipment = async (payload) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Shipments`;
  let data = payload
  data.AppID = FLAVOURCLOUD_APP_ID
  data.RestApiKey = FLAVOURCLOUD_API_KEY
  try {
    const response = await post(url, data);
    console.log('Shipping rates:', response.data);
    return response;
  } catch (error) {
    throw error
  }
};

module.exports = {
  newShipmentFlavourCloud: generateNewShipment,
};

