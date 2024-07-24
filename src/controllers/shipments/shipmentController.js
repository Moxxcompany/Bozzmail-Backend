const {
  newShipmentShippo,
  purchaseShipmentShippo,
  fetchRateByIDShippo,
  fetchShipmentByIdShippo,
  fetchGoShippoTrackShipment,
} = require("../../services/goShippoServices")

const {
  newShipmentFlavourCloud,
  getRatesFlavourCloud,
  fetchShipmentDetailsFlavourCloud,
  fetchFlavourTrackShipment,
} = require("../../services/flavourclousServices")

const {
  newEasypostShipment,
  purchaseEasypostShipment,
  fetchEasyPostTrackShipment,
} = require("../../services/easypostServices")
const {
  GOSHIPPO_SERVICE,
  FLAVOURCLOUD_SERVICE,
  EASYPOST_SERVICE,
  REWARD_POINTS,
} = require("../../constant/constants")
const {
  saveNewPurchasedShipment,
  saveNewShipment,
  fetchShipmentData,
  saveShipmentTrackingData,
  fetchShipmentPurchaseById,
} = require("../../helper/shipment")
const { sendNotification } = require("../../helper/sendNotification")
const { addUserPoints } = require("../../helper/rewards")

const createNewLabel = async (req, res) => {
  const payload = req.body
  const service = req.params.service
  const userId = req.userId
  try {
    let response
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await newShipmentShippo(payload)
        break
      case FLAVOURCLOUD_SERVICE:
        response = await newShipmentFlavourCloud(payload)
        if (response.data) {
          let shipmentPurchaseData = {
            userId: userId,
            service: FLAVOURCLOUD_SERVICE,
            shipmentId: response.data.ShipmentID,
            shipmentData: response.data,
          }
          const shipmentPurchase = await saveNewPurchasedShipment(
            shipmentPurchaseData
          )
          if (shipmentPurchase) {
            await sendNotification({
              user: req.userDetails,
              message: "Shipments Created Successfully",
              emailMessage: `<p>Shipments Created Successfully.</p>`,
              emailSubject: "Shipments",
            })
            return res.status(200).json({ data: shipmentPurchase })
          }
        }
        break
      case EASYPOST_SERVICE:
        if (payload.to_address.country != payload.from_address.country) {
          return res.status(400).json({
            message:
              "Easypost service does not provide international shipping.",
          })
        }
        response = await newEasypostShipment(payload)
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
    if (response.data) {
      let shipmentData = {
        userId: userId,
        service: service,
        shipmentId: response.data.id || response.data.object_id,
        shipmentData: response.data,
      }
      const shipment = await saveNewShipment(shipmentData)
      if (shipment) {
        await sendNotification({
          user: req.userDetails,
          message: "Shipments Created Successfully",
          emailMessage: `<p>Shipments Created Successfully.</p>`,
          emailSubject: "Shipments",
        })
        return res.status(200).json({ data: shipment })
      }
    } else {
      return res.status(500).json({ message: "Failed to create shipment" })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const fetchShipmentRates = async (req, res) => {
  const payload = req.body
  const service = req.params.service
  try {
    let response
    switch (service) {
      case FLAVOURCLOUD_SERVICE:
        response = await getRatesFlavourCloud(payload)
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
    if (response.data) {
      await sendNotification({
        user: req.userDetails,
        message: "Shipments rates",
        emailMessage: `<p>Shipments Rates.</p>`,
        emailSubject: "Shipments",
      })
      return res.status(200).json({ data: response.data })
    } else {
      return res.status(500).json({ message: "Failed to create shipment" })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const purchaseShipment = async (req, res) => {
  const payload = req.body
  const service = req.params.service
  const userId = req.userId
  try {
    let response
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await purchaseShipmentShippo(payload)
        if (response.data) {
          const rateData = await fetchRateByIDShippo(payload.rateId)
          const userShipment = await fetchShipmentByIdShippo(
            rateData.data.shipment
          )
          const { messages, status, rates, ...userShipmentData } =
            userShipment.data
          let shipmentData = {
            userId: userId,
            service: GOSHIPPO_SERVICE,
            shipmentId: rateData.data.shipment,
            shipmentData: userShipmentData,
          }
          shipmentData.shipmentData.transactionData = response.data
          shipmentData.shipmentData.selectedRate = rateData.data
          let rewardPoints = {
            userId: userId,
            points: +rateData.data.amount * REWARD_POINTS.PURCHASED_SHIPMENT.points,
            reason: REWARD_POINTS.PURCHASED_SHIPMENT.message,
          }
          await addUserPoints(rewardPoints)
          const shipment = await saveNewPurchasedShipment(shipmentData)
          if (shipment) {
            await sendNotification({
              user: req.userDetails,
              message: "Shipment purchase",
              emailMessage: `<p>Shipment purchase.</p>`,
              emailSubject: "Shipments Purchase details",
            })
            return res.status(200).json({ data: shipment })
          }
        }
        break
      case EASYPOST_SERVICE:
        response = await purchaseEasypostShipment(payload)
        if (response.data) {
          const { rates, ...data } = response.data
          let shipmentData = {
            userId: userId,
            service: EASYPOST_SERVICE,
            shipmentId: response.data.id,
            shipmentData: data,
          }
          let rewardPoints = {
            userId: userId,
            points: +data.selected_rate.rate * REWARD_POINTS.PURCHASED_SHIPMENT.points,
            reason: REWARD_POINTS.PURCHASED_SHIPMENT.message,
          }
          await addUserPoints(rewardPoints)
          const shipment = await saveNewPurchasedShipment(shipmentData)
          if (shipment) {
            await sendNotification({
              user: req.userDetails,
              message: "Shipment purchase",
              emailMessage: `<p>Shipment purchase.</p>`,
              emailSubject: "Shipments Purchase details",
            })
            return res.status(200).json({ data: shipment })
          }
        }
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const getUserShipments = async (req, res) => {
  const userId = req.userId
  const { page, limit } = req.query

  try {
    const result = await fetchShipmentData(userId, page, limit)

    return res.status(200).json({
      total: result.total,
      data: result.data,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const getShipmentsById = async (req, res) => {
  const { shipmentId } = req.params
  if (!shipmentId) {
    return res.status(500).json({ message: "Please enter a shipment id" })
  }
  try {
    const result = await fetchShipmentPurchaseById(shipmentId)
    return res.status(200).json({
      result,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const trackShipment = async (req, res) => {
  const payload = req.body
  const { trackNumber } = req.params
  const userId = req.userId
  const service = req.params.service
  let response
  try {
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await fetchGoShippoTrackShipment(payload)
        if (response.data) {
          let shipmentData = {
            userId: userId,
            service: GOSHIPPO_SERVICE,
            carrier: response?.data?.carrier,
            trackNumber: response?.data?.tracking_number,
            ShipmentTrackData: response?.data,
          }
          const shipmentTrackingData = await saveShipmentTrackingData(
            shipmentData
          )
          if (shipmentTrackingData) {
            await sendNotification({
              user: req.userDetails,
              message: "Your order status",
              emailMessage: `<p>Your order status.</p>`,
              emailSubject: "Status",
            })
            return res.status(200).json({
              data: shipmentTrackingData,
            })
          }
        }
        break
      case EASYPOST_SERVICE:
        response = await fetchEasyPostTrackShipment(payload)
        if (response.data) {
          let shipmentData = {
            userId: userId,
            service: EASYPOST_SERVICE,
            carrier: response?.data?.carrier,
            trackNumber: response?.data?.tracking_code,
            ShipmentTrackData: response?.data,
          }
          const shipmentTrackingData = await saveShipmentTrackingData(
            shipmentData
          )
          if (shipmentTrackingData) {
            await sendNotification({
              user: req.userDetails,
              message: "Your order status",
              emailMessage: `<p>Your order status.</p>`,
              emailSubject: "Status",
            })
            return res.status(200).json({
              data: shipmentTrackingData,
            })
          }
        }
        break
      case FLAVOURCLOUD_SERVICE:
        response = await fetchFlavourTrackShipment(trackNumber)
        if (response) {
          let shipmentData = {
            userId: userId,
            service: FLAVOURCLOUD_SERVICE,
            carrier: response?.data?.carrier || "",
            trackNumber: response?.data?.TrackingNumber,
            ShipmentTrackData: response?.data,
          }
          const shipmentTrackingData = await saveShipmentTrackingData(
            shipmentData
          )
          if (shipmentTrackingData) {
            return res.status(200).json({
              data: shipmentTrackingData,
            })
          }
        }
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

module.exports = {
  createNewLabel,
  fetchShipmentRates,
  purchaseShipment,
  getUserShipments,
  trackShipment,
  getShipmentsById,
}
