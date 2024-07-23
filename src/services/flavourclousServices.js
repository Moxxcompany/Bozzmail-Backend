const { post, get } = require("../utils/axios")
const {
  FLAVOURCLOUD_BASE_URL,
  FLAVOURCLOUD_API_KEY,
  FLAVOURCLOUD_APP_ID,
} = require("../constant/constants")

const generateNewShipment = async (payload) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Shipments`
  let data = {
    AppID: FLAVOURCLOUD_APP_ID,
    RestApiKey: FLAVOURCLOUD_API_KEY,
    Reference: payload.reference_id,
    ReasonForExport: payload.export_type,
    HashKey: payload.hash_key,
    DutyHashKey: payload.duty_hash_key || "",
    PickUpDate: payload.pickup_date, // format "YYYY-MM-DD"
    TermsOfTrade: payload.terms_of_trade,
    WeightUnit: payload.parcel.mass_unit.toUpperCase(),
    Currency: payload.currency,
    DimensionUnit: payload.parcel.distance_unit.toUpperCase(),
    ServiceCode: payload.service_code,
    ShipFromAddress: {
      Name: payload.from_address.name,
      AttentionName: payload.from_address.name,
      AddressLine1: payload.from_address.street1,
      AddressLine2: payload.from_address.street2 || "",
      City: payload.from_address.city,
      State: payload.from_address.state,
      Country: payload.from_address.country,
      Zip: payload.from_address.zip,
      Phone: payload.from_address.phone || "",
      Email: payload.from_address.email || "",
    },
    ShipToAddress: {
      Name: payload.to_address.name,
      AttentionName: payload.to_address.name,
      AddressLine1: payload.to_address.street1,
      AddressLine2: payload.to_address.street2,
      City: payload.to_address.city,
      State: payload.to_address.state,
      Country: payload.to_address.country,
      Zip: payload.to_address.zip,
      Phone: payload.to_address.phone || "",
      Email: payload.to_address.email || "",
    },
    Shipments: [
      {
        Piece: [],
        Package: {
          Weight: payload.parcel.weight,
          Length: payload.parcel.length,
          Width: payload.parcel.width,
          Height: payload.parcel.height,
        },
      },
    ],
  }
  payload.items.forEach((item) => {
    let itemData = {
      Quantity: item.quantity,
      Weight: item.weight,
      SalePrice: item.value,
      HSCode: item.hs_tariff_number,
      OriginCountryCode: item.origin_country,
      Description: item.description,
    }
    data.Shipments[0].Piece.push(itemData)
  })
  try {
    return await post(url, data)
  } catch (error) {
    throw error
  }
}

const getRates = async (payload) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Rates`
  let data = {
    AppID: FLAVOURCLOUD_APP_ID,
    RestApiKey: FLAVOURCLOUD_API_KEY,
    Reference: payload.reference_id,
    LabelFormat: "PDF",
    WeightUnit: payload.parcel.mass_unit.toUpperCase(),
    Currency: payload.currency,
    DimensionUnit: payload.parcel.distance_unit.toUpperCase(),
    Insurance: payload.insurance_added ? "Y" : "N",
    ServiceCode: payload.service_code, //"STANDARD", "EXPRESS"
    TermsOfTrade: ["DDP", "DDU"],
    IsReturn: "N",
    IncludeLandedCost: true,
    ShipFromAddress: {
      Name: payload.from_address.name,
      AttentionName: payload.from_address.name,
      AddressLine1: payload.from_address.street1,
      AddressLine2: payload.from_address.street2 || "",
      City: payload.from_address.city,
      State: payload.from_address.state,
      Country: payload.from_address.country,
      Zip: payload.from_address.zip,
      Phone: payload.from_address.phone || "",
      Email: payload.from_address.email || "",
    },
    ShipToAddress: {
      Name: payload.to_address.name,
      AttentionName: payload.to_address.name,
      AddressLine1: payload.to_address.street1,
      AddressLine2: payload.to_address.street2,
      City: payload.to_address.city,
      State: payload.to_address.state,
      Country: payload.to_address.country,
      Zip: payload.to_address.zip,
      Phone: payload.to_address.phone || "",
      Email: payload.to_address.email || "",
    },
    ReasonForExport: payload.export_type, // Possible values could be 'documents', 'gift', 'merchandise', 'returned_goods', 'sample', or 'other'
    Pieces: [],
    Package: {
      Weight: payload.parcel.weight,
      Length: payload.parcel.length,
      Width: payload.parcel.width,
      Height: payload.parcel.height,
    },
  }
  payload.items.forEach((item) => {
    let itemData = {
      Quantity: item.quantity,
      Weight: item.weight,
      SalePrice: item.value,
      HSCode: item.hs_tariff_number,
      OriginCountryCode: item.origin_country,
      Description: item.description,
      Category: item.category,
    }
    data.Pieces.push(itemData)
  })
  try {
    return await post(url, data)
  } catch (error) {
    throw error
  }
}

const newHscode = async (payload) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Classifications`
  let data = {
    AppID: FLAVOURCLOUD_APP_ID,
    RestApiKey: FLAVOURCLOUD_API_KEY,
    Products: [
      {
        Description: payload.product.description,
        Image: payload.product.image_url,
        Title: payload.product.title,
      },
    ],
  }
  try {
    return await post(url, data)
  } catch (error) {
    throw error
  }
}

const fetchShipmentDetails = async (shipmentId) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Shipments/${FLAVOURCLOUD_APP_ID}/${FLAVOURCLOUD_API_KEY}?ShipmentID=${shipmentId}`
  try {
    return await get(url)
  } catch (error) {
    throw error
  }
}

const fetchFlavourTrackShipment = async (trackNumber) => {
  const url = `${FLAVOURCLOUD_BASE_URL}/Tracking/${FLAVOURCLOUD_APP_ID}/${FLAVOURCLOUD_API_KEY}/${trackNumber}`
  try {
    return await get(url)
  } catch (error) {
    throw error
  }
}
module.exports = {
  newShipmentFlavourCloud: generateNewShipment,
  getRatesFlavourCloud: getRates,
  newHscode,
  fetchShipmentDetailsFlavourCloud: fetchShipmentDetails,
  fetchFlavourTrackShipment: fetchFlavourTrackShipment,
}
