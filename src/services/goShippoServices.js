const { post, get } = require("../utils/axios")
const { GOSHIPPO_API_KEY, GOSHIPPO_BASE_URL } = require("../constant/constants")
const GOSHIPPO_TOKEN = `ShippoToken ${GOSHIPPO_API_KEY}`

const generateNewShipment = async (data) => {
  const url = `${GOSHIPPO_BASE_URL}/shipments/`
  try {
    const payload = {
      address_from: data.address_from,
      address_to: data.address_to,
      parcels: [data.parcel],
      async: false,
      customs_declaration: data.customs_declaration,
      extra: {},
    }
    if (data.insurance_added) {
      payload.extra.insurance = data.insurance
    }
    if (data.additional_info) {
      payload.extra.additional_info = data.additional_info
    }
    const response = await post(url, payload, GOSHIPPO_TOKEN)
    return response
  } catch (error) {
    throw error
  }
}

const purchaseShipment = async (payload) => {
  const url = `${GOSHIPPO_BASE_URL}/transactions`
  try {
    let data = {
      rate: payload.rateId,
      async: false,
      label_file_type: "PDF",
    }
    const response = await post(url, data, GOSHIPPO_TOKEN)
    return response
  } catch (error) {
    throw error
  }
}

const generateNewCustom = async (payload) => {
  const url = `${GOSHIPPO_BASE_URL}/customs/declarations`
  const data = {
    contents_type: payload.contents_type.toUpperCase(), //Enum: "DOCUMENTS" "GIFT" "SAMPLE" "MERCHANDISE" "HUMANITARIAN_DONATION" "RETURN_MERCHANDISE" "OTHER"
    non_delivery_option: payload.non_delivery_option.toUpperCase(), //Enum: "ABANDON" "RETURN"
    certify: true,
    certify_signer: payload.customs_signer,
    contents_explanation: payload?.contents_explanation, // if content_type is 'other' Need a brief description.
    incoterm: payload.incoterm,
    eel_pfc: payload.eel_pfc,
    items: [],
  }
  payload.customs_items.forEach((item) => {
    let customData = {
      description: item.description,
      quantity: item.quantity,
      net_weight: item.weight,
      mass_unit: item.mass_unit,
      value_amount: item.value,
      value_currency: item.currency,
      hs_code: item.hs_tariff_number,
      origin_country: item.origin_country,
    }
    data.items.push(customData)
  })
  try {
    return await post(url, data, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

const fetchRateById = async (id) => {
  const url = `${GOSHIPPO_BASE_URL}/rates/${id}`
  try {
    return await get(url, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

const fetchShipmentById = async (id) => {
  const url = `${GOSHIPPO_BASE_URL}/shipments/${id}`
  try {
    return await get(url, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

const createPickupShipment = async (data) => {
  const url = `${GOSHIPPO_BASE_URL}/pickups`
  const payload = {
    carrier_account: data.carrier_account,
    location: {
      building_location_type: data.building_location_type, //"Back Door" "Ring Bell" "Security Deck" "Shipping Dock" "Front Door" "Knock on Door" "In/At Mailbox" "Mail Room" "Office" "Other" "Reception" "Side Door"
      building_type: data.building_type,
      instructions: data.instructions,
      address: {
        name: data.address.name,
        company: data.address.company,
        street1: data.address.street1,
        city: data.address.city,
        state: data.address.state,
        zip: data.address.zip,
        country: data.address.country,
        phone: data.address?.phone,
        email: data.address?.email,
      },
    },
    transactions: [data.transaction_id],
    requested_start_time: data.min_datetime,
    requested_end_time: data.max_datetime,
    is_test: data.is_test,
  }
  try {
    return await post(url, payload, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

const fetchGoShippoTrackShipment = async (data) => {
  const url = `${GOSHIPPO_BASE_URL}/tracks`
  const payload = {
    carrier: data.carrier,
    tracking_number: data.tracking_number,
  }
  try {
    return await post(url, payload, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

const createNewBatch = async (data) => {
  const url = `${GOSHIPPO_BASE_URL}/batches`
  const payload = {
    default_carrier_account: data.default_carrier_account,
    default_servicelevel_token: data.default_servicelevel_token,
    label_filetype: data.label_filetype,
    batch_shipments: data.batch_shipments,
  }
  try {
    return await post(url, payload, GOSHIPPO_TOKEN)
  } catch (error) {
    throw error
  }
}

module.exports = {
  newShipmentShippo: generateNewShipment,
  purchaseShipmentShippo: purchaseShipment,
  newCustomFormShippo: generateNewCustom,
  fetchRateByIDShippo: fetchRateById,
  fetchShipmentByIdShippo: fetchShipmentById,
  newPickupShippo: createPickupShipment,
  fetchGoShippoTrackShipment: fetchGoShippoTrackShipment,
  newBatchShippo: createNewBatch,
}
