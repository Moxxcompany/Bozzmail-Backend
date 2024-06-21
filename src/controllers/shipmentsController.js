const {
  newShipmentShippo
} = require('../services/goShippoServices');

const {
  newShipmentFlavourCloud
} = require('../services/flavourclousServices');

const {
  newEasypostShipment
} = require('../services/easypostServices');

const createNewShipment = async (req, res) => {
  const payload = req.body;
  const service = req.params.service;
  try {
    let response;
    switch (service) {
      case 'goshippo':
        response = await newShipmentShippo(payload);
        break;
      case 'flavourcloud':
        response = await newShipmentFlavourCloud(payload);
        break;
      case 'easypost':
        response = await newEasypostShipment(payload)
        break;
      default:
        res.status(500).json({ error: 'URL is not Valid.' });
    }
    if (response.data) {
      res.status(200).json({ data: response.data });
    } else {
      res.status(500).json({ error: 'Failed to create shipment' });
    }
  } catch (error) {
    res.status(500).json({ error: error?.response?.data?.error || error?.response?.data });
  }
};

module.exports = {
  createNewShipment
};
