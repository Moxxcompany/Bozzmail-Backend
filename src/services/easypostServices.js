const { post } = require('../utils/axios')
const {
  EASYPOST_BASE_URL,
  EASYPOST_API_KEY
} = require('../constant/constants')
const EASYPOST_TOKEN = `Basic ${Buffer.from(EASYPOST_API_KEY + ':').toString('base64')}`

// Weight are in ounces (OZ) to one decimal point
// Dimensions are always inches(IN) to one decimal point
const generateNewShipment = async (data) => {
  const url = `${EASYPOST_BASE_URL}/v2/shipments`;
  try {
    const payload = {
      shipment: {
        to_address: data.to_address,
        from_address: data.from_address,
        parcel: data.parcel
      }
    }
    return await post(url, payload, EASYPOST_TOKEN);
  } catch (error) {
    throw error
  }
};

const purchaseShipment = async (payload) => {
  const url = `${EASYPOST_BASE_URL}/v2/shipments/${payload.shipmentId}/buy`
  try {
    let data = {
      rate: {
        id: payload.rateId
      },
    }
    if (payload.insurance) {
      data.insurance = parseFloat(payload.insurance.amount)
    }
    return await post(url, data, EASYPOST_TOKEN);
  } catch (error) {
    throw error
  }
}

const generateNewCustom = async (data) => {
  const url = `${EASYPOST_BASE_URL}/v2/customs_infos`;
  const payload = {
    customs_info: {
      customs_certify: true,
      customs_signer: data.customs_signer,
      contents_type: data.contents_type,  // 'merchandise', 'returned_goods', 'documents', 'gift', 'sample', 'other','dangerous_goods', 'humanitarian_donation'.
      contents_explanation: data?.contents_explanation, // if content_type is 'other' Need a brief description.
      restriction_type: data.restriction_type, // none', 'other', 'quarantine', 'sanitary_phytosanitary_inspection'.
      restriction_comments: data?.restriction_comments, // if restriction_type is not none. Need a brief description
      eel_pfc: data.eel_pfc, // "NOEEI 30.37(a)" or ITN
      customs_items: data.customs_items
    }
  }
  try {
    return await post(url, payload, EASYPOST_TOKEN);
  } catch (error) {
    throw error
  }
}

const createPickupShipment = async (data) => {
  const url = `${EASYPOST_BASE_URL}/v2/pickups`
  const payload = {
    pickup: {
      reference: data.reference,
      min_datetime: data.min_datetime, // YYYY-MM-DD HH:MM:SS
      max_datetime: data.max_datetime,
      shipment: data.shipment_id,
      address: data.address_id,
      is_account_address: data.is_account_address,
      instructions: data.instructions,
      carrier_accounts: data.carrier_accounts
    }
  }
  try {
    return await post(url, payload, EASYPOST_TOKEN);
  } catch (error) {
    throw error
  }
}

module.exports = {
  newEasypostShipment: generateNewShipment,
  purchaseEasypostShipment: purchaseShipment,
  newEasypostCustom: generateNewCustom,
  newPickUpEasypost: createPickupShipment
};

