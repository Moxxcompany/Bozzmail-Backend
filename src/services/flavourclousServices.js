const { post } = require('../utils/axios')
const baseUrl = process.env.FLAVOURCLOUD_BASEURL
const appID = process.env.FLAVOURCLOUD_APPID
const apiKey = process.env.FLAVOURCLOUD_API_KEY

const generateNewShipment = async (payload) => {
  const url = `${baseUrl}/Shipments`;
  let data = payload
  data.AppID = appID
  data.RestApiKey = apiKey
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

