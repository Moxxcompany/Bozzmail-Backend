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
  PAYMENT_STATUS_INPROCESS,
  FE_APP_BASE_URL,
  PAYMENT_STATUS_SUCCESS,
  PAYMENT_STATUS_FAILURE,
} = require("../../constant/constants")
const {
  saveNewPurchasedShipment,
  saveNewShipment,
  fetchShipmentData,
  saveShipmentTrackingData,
  fetchShipmentPurchaseById,
} = require("../../helper/shipment")
const { sendNotification } = require("../../helper/sendNotification")
const { addUserRewardPoints } = require("../../helper/rewards")
const { logger } = require("../../utils/logger")
const { fetchUserById } = require("../../helper/user")
const { saveNewPaymentTracks, fetchPaymentTrackById } = require("../../helper/paymentTracks")
const { generatePaymentLink } = require("../../services/dynoPayServices")

const createNewLabel = async (req, res) => {
  const { amount, ...payload } = req.body
  const service = req.params.service
  const userId = req.userId
  try {
    let response
    switch (service) {
      case GOSHIPPO_SERVICE:
        response = await newShipmentShippo(payload)
        break
      case FLAVOURCLOUD_SERVICE:
        if (!amount) {
          return return res.status(400).json({ message: "Amount is missing for the payment." })
        }
        const userDetails = await fetchUserById(userId, true)
        if (!userDetails.walletToken) {
          return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
        }
        const paymentTracks = {
          userId: userId,
          dynoPayPaymentStatus: PAYMENT_STATUS_INPROCESS,
          service: service,
          shipmentPaymentStatus: PAYMENT_STATUS_INPROCESS,
          metaData: payload,
          amount: amount
        }
        const newPaymentTrack = await saveNewPaymentTracks(paymentTracks)
        const meta_data = {
          product: newPaymentTrack._id.toString()
        }
        const redirect_url = `${req.protocol}://${req.get('host')}/webhooks/dynopay-purchase`
        const { data } = await generatePaymentLink(amount, redirect_url, meta_data, userDetails.walletToken)
        if (data && data.data) {
          return return res.status(200).json({ message: 'Your payment link', data: data.data })
        }
        break
      case EASYPOST_SERVICE:
        if (payload.to_address.country != payload.from_address.country) {
          return return res.status(400).json({
            message:
              "Easypost service does not provide international shipping.",
          })
        }
        response = await newEasypostShipment(payload)
        break
      default:
        return return res.status(500).json({ message: "Something went wrong." })
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
        return return res.status(200).json({ data: shipment })
      }
    } else {
      return return res.status(500).json({ message: "Failed to create shipment" })
    }
  } catch (error) {
    const err = { message: 'Failed to create a new shipment', error: error?.response?.data?.error || error?.response?.data || error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
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
        return return res.status(500).json({ message: "Something went wrong." })
    }
    if (response.data) {
      await sendNotification({
        user: req.userDetails,
        message: "Shipments rates",
        emailMessage: `<p>Shipments Rates.</p>`,
        emailSubject: "Shipments",
      })
      return return res.status(200).json({ data: response.data })
    } else {
      return return res.status(500).json({ message: "Failed to create shipment" })
    }
  } catch (error) {
    const err = { message: 'Failed to fetch rates for a shipment', error: error?.response?.data?.error || error?.response?.data || error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const purchaseShipmentLink = async (req, res) => {
  const { amount, ...payload } = req.body
  const service = req.params.service
  const userId = req.userId
  try {
    if (!amount) {
      return return res.status(400).json({ message: "Amount is missing for the payment." })
    }
    if (!payload.rateId) {
      return return res.status(400).json({ message: "Invalid rateId" })
    }
    if (service === EASYPOST_SERVICE && !payload.shipmentId) {
      return return res.status(400).json({ message: "Invalid shipmentId" })
    }
    if (service !== EASYPOST_SERVICE && service !== GOSHIPPO_SERVICE) {
      return return res.status(400).json({ message: "Something went wrong." })
    }
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }
    const paymentTracks = {
      userId: userId,
      dynoPayPaymentStatus: PAYMENT_STATUS_INPROCESS,
      service: service,
      shipmentPaymentStatus: PAYMENT_STATUS_INPROCESS,
      metaData: payload,
      amount: amount
    }
    const newPaymentTrack = await saveNewPaymentTracks(paymentTracks)
    const meta_data = {
      product: newPaymentTrack._id.toString()
    }
    const redirect_url = `${req.protocol}://${req.get('host')}/webhooks/dynopay-purchase`
    const { data } = await generatePaymentLink(amount, redirect_url, meta_data, userDetails.walletToken)
    if (data && data.data) {
      return return res.status(200).json({ message: 'Your payment link', data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to create  payment link", error: error.data }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const getUserShipments = async (req, res) => {
  const userId = req.userId
  const { page, limit } = req.query

  try {
    const result = await fetchShipmentData(userId, page, limit)

    return return res.status(200).json({
      total: result.total,
      data: result.data,
    })
  } catch (error) {
    const err = { message: 'Failed to fetch user shipments', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const getShipmentsById = async (req, res) => {
  const { shipmentId } = req.params
  if (!shipmentId) {
    return return res.status(500).json({ message: "Please enter a shipment id" })
  }
  try {
    const result = await fetchShipmentPurchaseById(shipmentId)
    return return res.status(200).json({
      result,
    })
  } catch (error) {
    const err = { message: 'Failed to fetch shipment details', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
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
        if (!payload.carrier || !payload.tracking_number) {
          return return res.status(400).json({ message: "Invalid carrier or tracking number" })
        }
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
            return return res.status(200).json({
              data: shipmentTrackingData,
            })
          }
        }
        break
      case EASYPOST_SERVICE:
        if (!payload.carrier || !payload.tracking_code) {
          return return res.status(400).json({ message: "Invalid carrier or tracking code" })
        }
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
            return return res.status(200).json({
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
            return return res.status(200).json({
              data: shipmentTrackingData,
            })
          }
        }
        break
      default:
        return return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    const err = { message: 'Failed to track a shipment', error: error?.response?.data?.error || error?.response?.data || error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const purchaseShipment = async (req, res) => {
  const { transaction_id, payment_type, status } = req.query
  const meta_data = JSON.parse(req.query.meta_data)
  try {
    const paymentTrack = await fetchPaymentTrackById(meta_data.product)
    paymentTrack.dynoPayPaymentStatus = status === 'successful' ? PAYMENT_STATUS_SUCCESS : PAYMENT_STATUS_FAILURE
    paymentTrack.dynoPayTransactionId = transaction_id
    paymentTrack.dynoPayPaymentMode = payment_type
    await paymentTrack.save()
    const userId = paymentTrack.userId.toString()
    const userDetails = await fetchUserById(userId)
    let response
    switch (paymentTrack.service) {
      case GOSHIPPO_SERVICE:
        response = await purchaseShipmentShippo(paymentTrack.metaData)
        if (response.data) {
          const rateData = await fetchRateByIDShippo(paymentTrack.metaData.rateId)
          const userShipment = await fetchShipmentByIdShippo(
            rateData.data.shipment
          )
          const { messages, status, rates, ...userShipmentData } =
            userShipment.data
          let shipmentData = {
            userId: userId,
            service: GOSHIPPO_SERVICE,
            shipmentId: rateData.data.shipment,
            dynopayTransactionId: transaction_id,
            shipmentData: userShipmentData,
          }
          shipmentData.shipmentData.transactionData = response.data
          shipmentData.shipmentData.selectedRate = rateData.data
          let rewardPoints = {
            userId: userId,
            points: paymentTrack.amount * REWARD_POINTS.PURCHASED_SHIPMENT.points,
            reason: REWARD_POINTS.PURCHASED_SHIPMENT.message,
          }
          await addUserRewardPoints(rewardPoints)
          const shipment = await saveNewPurchasedShipment(shipmentData)
          paymentTrack.shipmentPaymentStatus = PAYMENT_STATUS_SUCCESS
          paymentTrack.shipmentPurchaseId = shipment._id
          await paymentTrack.save()
          if (shipment) {
            await sendNotification({
              user: userDetails,
              message: "Shipment purchase",
              emailMessage: `<p>Shipment purchase.</p>`,
              emailSubject: "Shipments Purchase details",
            })
            return return res.status(200).json({ data: shipment })
          }
        }
        break
      case EASYPOST_SERVICE:
        response = await purchaseEasypostShipment(paymentTrack.metaData)
        if (response.data) {
          const { rates, ...data } = response.data
          let shipmentData = {
            userId: userId,
            service: EASYPOST_SERVICE,
            dynopayTransactionId: transaction_id,
            shipmentId: response.data.id,
            shipmentData: data,
          }
          let rewardPoints = {
            userId: userId,
            points: paymentTrack.amount * REWARD_POINTS.PURCHASED_SHIPMENT.points,
            reason: REWARD_POINTS.PURCHASED_SHIPMENT.message,
          }
          await addUserRewardPoints(rewardPoints)
          const shipment = await saveNewPurchasedShipment(shipmentData)
          if (shipment) {
            paymentTrack.shipmentPaymentStatus = PAYMENT_STATUS_SUCCESS
            paymentTrack.shipmentPurchaseId = shipment._id
            await paymentTrack.save()
            await sendNotification({
              user: userDetails,
              message: "Shipment purchase",
              emailMessage: `<p>Shipment purchase.</p>`,
              emailSubject: "Shipments Purchase details",
            })
            return return res.status(200).json({ data: shipment })
          }
        }
        break
      case FLAVOURCLOUD_SERVICE:
        response = await newShipmentFlavourCloud(paymentTrack.metaData)
        if (response.data) {
          let shipmentPurchaseData = {
            userId: userId,
            service: FLAVOURCLOUD_SERVICE,
            dynopayTransactionId: transaction_id,
            shipmentId: response.data.ShipmentID,
            shipmentData: response.data,
          }
          const shipmentPurchase = await saveNewPurchasedShipment(
            shipmentPurchaseData
          )
          if (shipmentPurchase) {
            paymentTrack.shipmentPaymentStatus = PAYMENT_STATUS_SUCCESS
            paymentTrack.shipmentPurchaseId = shipmentPurchase._id
            await paymentTrack.save()
            await sendNotification({
              user: userDetails,
              message: "Shipments Created Successfully",
              emailMessage: `<p>Shipments Created Successfully.</p>`,
              emailSubject: "Shipments",
            })
            return return res.status(200).json({ data: shipmentPurchase })
          }
        }
        break
      default:
        return return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    const redirectUrl = `${FE_APP_BASE_URL}/payment?dynoPayment=${status === 'successful' ? PAYMENT_STATUS_SUCCESS : PAYMENT_STATUS_FAILURE}&shipmentPayment=${PAYMENT_STATUS_FAILURE}`
    const err = { message: 'Failed to purchase a new shipment', error: error?.response?.data?.error || error?.response?.data || error, paymentTrackId: meta_data.product }
    logger.error(err)
    return res.redirect(redirectUrl);
  }
}

module.exports = {
  createNewLabel,
  fetchShipmentRates,
  purchaseShipmentLink,
  getUserShipments,
  trackShipment,
  getShipmentsById,
  purchaseShipment
}
