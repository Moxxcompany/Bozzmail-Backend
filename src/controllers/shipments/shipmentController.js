const {
  newShipmentShippo,
  purchaseShipmentShippo,
  fetchRateByIDShippo,
  fetchShipmentByIdShippo
} = require('../../services/goShippoServices');

const {
  newShipmentFlavourCloud,
  getRatesFlavourCloud,
  fetchShipmentDetailsFlavourCloud
} = require('../../services/flavourclousServices');

const {
  newEasypostShipment,
  purchaseEasypostShipment
} = require('../../services/easypostServices');
const {
  GOSHIPPO_SERVICE,
  FLAVOURCLOUD_SERVICE,
  EASYPOST_SERVICE
} = require('../../constant/constants');
const {
  saveNewPurchasedShipment,
  saveNewShipment
} = require('../../helper/shipment');

const createNewLabel = async (req, res) => {
  const payload = req.body;
  const service = req.params.service;
  const userId = req.userId;
  try {
    let response;
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await newShipmentShippo(payload);
        break;
      case FLAVOURCLOUD_SERVICE:
        response = await newShipmentFlavourCloud(payload);
        if (response.data) {
          let shipmentPurchaseData = {
            userId: userId,
            service: FLAVOURCLOUD_SERVICE,
            shipmentId: response.data.ShipmentID,
            shipmentData: response.data
          }
          const shipmentPurchase = await saveNewPurchasedShipment(shipmentPurchaseData)
          if (shipmentPurchase) {
            return res.status(200).json({ data: shipmentPurchase })
          }
        }
        break;
      case EASYPOST_SERVICE:
        if (payload.to_address.country != payload.from_address.country) {
          return res.status(400).json({ message: 'Easypost service does not provide international shipping.' });
        }
        response = await newEasypostShipment(payload)
        break;
      default:
        return res.status(500).json({ message: 'Something went wrong.' });
    }
    if (response.data) {
      let shipmentData = {
        userId: userId,
        service: service,
        shipmentId: response.data.id || response.data.object_id,
        shipmentData: response.data
      }
      const shipment = await saveNewShipment(shipmentData)
      if (shipment) {
        return res.status(200).json({ data: shipment })
      }
    } else {
      return res.status(500).json({ message: 'Failed to create shipment' });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
};

const fetchShipmentRates = async (req, res) => {
  const payload = req.body;
  const service = req.params.service;
  try {
    let response;
    switch (service) {
      case FLAVOURCLOUD_SERVICE:
        response = await getRatesFlavourCloud(payload);
        break;
      default:
        return res.status(500).json({ message: 'Something went wrong.' });
    }
    if (response.data) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(500).json({ message: 'Failed to create shipment' });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
}

const purchaseShipment = async (req, res) => {
  const payload = req.body;
  const service = req.params.service;
  const userId = req.userId;
  try {
    let response;
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await purchaseShipmentShippo(payload);
        if (response.data) {
          const rateData = await fetchRateByIDShippo(payload.rateId)
          const userShipment = await fetchShipmentByIdShippo(rateData.data.shipment)
          const { messages, status, rates, ...userShipmentData } = userShipment.data
          let shipmentData = {
            userId: userId,
            service: GOSHIPPO_SERVICE,
            shipmentId: rateData.data.shipment,
            shipmentData: userShipmentData
          }
          shipmentData.shipmentData.transactionData = response.data
          shipmentData.shipmentData.selectedRate = rateData.data
          const shipment = await saveNewPurchasedShipment(shipmentData)
          if (shipment) {
            return res.status(200).json({ data: shipment })
          }
        }
        break;
      case EASYPOST_SERVICE:
        response = await purchaseEasypostShipment(payload);
        if (response.data) {
          const { rates, ...data } = response.data
          let shipmentData = {
            userId: userId,
            service: EASYPOST_SERVICE,
            shipmentId: response.data.id,
            shipmentData: data
          }
          const shipment = await saveNewPurchasedShipment(shipmentData)
          if (shipment) {
            return res.status(200).json({ data: shipment })
          }
        }
        break;
      default:
        return res.status(500).json({ message: 'Something went wrong.' });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
}

module.exports = {
  createNewLabel,
  fetchShipmentRates,
  purchaseShipment
};
