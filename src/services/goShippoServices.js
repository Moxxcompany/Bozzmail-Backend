const { post } = require('../utils/axios')
const GOSHIPPO_BASE_URL = process.env.GOSHIPPO_BASE_URL
const GOSHIPPO_API_KEY = process.env.GOSHIPPO_API_KEY
const GOSHIPPO_TOKEN = `ShippoToken ${GOSHIPPO_API_KEY}`

if (
  !GOSHIPPO_BASE_URL ||
  !GOSHIPPO_API_KEY
) {
  throw new Error('Environment variables for goshippo are not set.');
}

const generateNewShipment = async (data) => {
  const url = `${GOSHIPPO_BASE_URL}/shipments/`;
  try {
    const payload = {
      address_from: data.address_from,
      address_to: data.address_to,
      parcels: data.parcels,
      async: false
    }
    const response = await post(url, payload, GOSHIPPO_TOKEN)
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  newShipmentShippo: generateNewShipment,
};
