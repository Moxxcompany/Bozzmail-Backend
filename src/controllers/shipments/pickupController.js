const {
  newPickupShippo
} = require('../../services/goShippoServices');

const {
  newPickUpEasypost
} = require('../../services/easypostServices');
const {
  GOSHIPPO_SERVICE,
  EASYPOST_SERVICE
} = require('../../constant/constants');

const createNewPickup = async (req, res) => {
  const payload = req.body;
  const service = req.params.service;
  const userId = req.userId;
  try {
    let response;
    switch (service) {
      case EASYPOST_SERVICE:
        response = await newPickUpEasypost(payload);
        break;
      case GOSHIPPO_SERVICE:
        response = await newPickupShippo(payload);
        break;
      default:
        return res.status(500).json({ message: 'Something went wrong.' });
    }
    if (response.data) {
      return res.status(200).json({ data: response.data })
    } else {
      return res.status(500).json({ message: 'Failed to create customs' });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
};

module.exports = {
  createNewPickup
};
