const { newPickupShippo } = require("../../services/goShippoServices")

const { newPickUpEasypost } = require("../../services/easypostServices")
const {
  GOSHIPPO_SERVICE,
  EASYPOST_SERVICE,
} = require("../../constant/constants")
const { savePickupData, fetchPickUpByUserId } = require("../../helper/pickup")
const { sendNotification } = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")

const createNewPickup = async (req, res) => {
  const payload = req.body
  const service = req.params.service
  const userId = req.userId
  try {
    let response
    switch (service) {
      case EASYPOST_SERVICE:
        response = await newPickUpEasypost(payload)
        if (response?.data) {
          let pickupData = {
            userId: userId,
            service: EASYPOST_SERVICE,
            pickupId: response.data?.id,
            PickupData: response?.data,
          }
          const pickup = await savePickupData(pickupData)
          if (pickup) {
            await sendNotification({
              user: req.userDetails,
              message: "Your pickup created successfully",
              emailMessage: `<p>Your pickup created successfully.</p>`,
              emailSubject: "Congrats",
            })
            return res.status(200).json({ data: pickup })
          }
        }
        break
      case GOSHIPPO_SERVICE:
        response = await newPickupShippo(payload)
        if (response?.data) {
          let pickupData = {
            userId: userId,
            service: GOSHIPPO_SERVICE,
            pickupId: response.data?.object_id,
            PickupData: response?.data,
          }
          const pickup = await savePickupData(pickupData)
          if (pickup) {
            return res.status(200).json({ data: pickup })
          }
        }
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
    if (response.data) {
      return res.status(200).json({ data: response.data })
    } else {
      return res.status(500).json({ message: "Failed to create customs" })
    }
  } catch (error) {
    const err = error?.response?.data?.error || error?.response?.data || 'Error creating a new pickup'
    logger.error({ message: 'Failed to create a pickup', error: err })
    res.status(error.status || 500).json({ message: err })
  }
}

const getPickup = async (req, res) => {
  try {
    const id = req.userId
    const { service, page, limit } = req.query
    const response = await fetchPickUpByUserId(id, service, page, limit)
    return res.status(200).json({ response })
  } catch (error) {
    const err = error || 'Error fetching user pickup list'
    logger.error({ message: 'Failed to fetch user pickup list', error: err })
    res.status(error.status || 500).json({ message: err })
  }
}

module.exports = {
  createNewPickup,
  getPickup,
}
