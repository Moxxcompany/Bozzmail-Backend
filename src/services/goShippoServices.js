const { post } = require('../utils/axios')
const baseUrl = process.env.GOSHIPPO_BASE_URL
const token = `ShippoToken ${process.env.GOSHIPPO_API_KEY}`

const generateNewShipment = async (data) => {
  const url = `${baseUrl}/shipments/`;
  try {
    const payload = {
      address_from: data.address_from,
      address_to: data.address_to,
      parcels: data.parcels,
      async: false
    }
    const response = await post(url, payload, token)
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = { 
  newShipmentShippo: generateNewShipment,
};
