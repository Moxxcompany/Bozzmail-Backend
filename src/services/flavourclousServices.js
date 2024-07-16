const { post } = require('../utils/axios')
const {
  FLAVOURCLOUD_BASE_URL,
  FLAVOURCLOUD_API_KEY,
  FLAVOURCLOUD_APP_ID
} = require('../constant/constants')

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

