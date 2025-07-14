const { fetchUserById } = require("../../helper/user")
const { sendNotification } = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")
const {
  registerUserForPayment,
  generateAddFundsLink,
  fetchDynoWalletBalance,
  fetchUserTransactions,
  fetchUserTransactionById
} = require("../../services/dynoPayServices")
const { saveNewWalletFundDetails } = require("../../helper/paymentTracks")

const addUserWalletDetails = async (req, res) => {
  const { email, name, mobile } = req.body
  const userId = req.userId
  try {
    if (!name) {
      return return res.status(400).json({ message: "Name is required" })
    }
    const userDetails = await fetchUserById(userId, true)
    if (userDetails.walletToken) {
      return return res.status(400).json({ message: "User already activated wallet" })
    }

    const { data } = await registerUserForPayment(email, name, mobile)
    if (data && data.data) {
      userDetails.walletToken = data.data.token
      userDetails.walletId = data.data.customer_id
      await userDetails.save()
      await sendNotification({
        user: userDetails,
        message: "You have activated our wallet succesfully. You can start using our wallet for payments.",
        emailMessage: `<p>Your Wallet has been activated</p>`,
        emailSubject: "Wallet activated",
      })
    }
    return return res.status(200).json({ message: 'You have successfully activated your wallet.' })
  } catch (error) {
    const err = { message: "Failed to activate user wallet", error: error.data }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const addWalletFundsLink = async (req, res) => {
  const { amount } = req.body
  const userId = req.userId
  try {
    if (!amount) {
      return return res.status(400).json({ message: "Amount is required" })
    }
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const redirect_url = `${req.protocol}://${req.get('host')}/webhooks/${userId}/dynopay-addFund`
    const { data } = await generateAddFundsLink(amount, redirect_url, userDetails.walletToken)
    if (data && data.data) {
      return return res.status(200).json({ message: 'Your link to add funds', data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to create link to add funds", error: error?.data || error }
    logger.error(err)
    return return res.status(500).json(err)
  }
}

const getUserWalletBalance = async (req, res) => {
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchDynoWalletBalance(userDetails.walletToken)
    if (data && data.data) {
      return return res.status(200).json({ message: 'Your dynopay wallet balance is fetched successfully', data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch wallet Balance", error: error?.data || error }
    logger.error(err)
    return return res.status(500).json(err)
  }
}

const getUserTransactions = async (req, res) => {
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchUserTransactions(userDetails.walletToken)
    if (data && data.data) {
      return return res.status(200).json({ data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch user transactions", error: error?.data || error }
    logger.error(err)
    return return res.status(500).json(err)
  }
}

const getUserTransactionById = async (req, res) => {
  const userId = req.userId
  const transactionId = req.params.transactionId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchUserTransactionById(userDetails.walletToken, transactionId)
    if (data && data.data) {
      return return res.status(200).json({ data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch transaction details", error: error?.data || error }
    logger.error(err)
    return return res.status(500).json(err)
  }
}

const addFundWalletsHook = async (req, res) => {
  const { transaction_id, status } = req.query
  const userId = req.params.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    const { data } = await fetchUserTransactionById(userDetails.walletToken, transaction_id)
    if (data && data.data) {
      const newAddFundData = {
        userId: userId,
        paymentStatus: data.data.status,
        transactionId: data.data.id,
        amount: data.data.base_amount,
        paymentMode:  data.data.payment_mode,
        transactionalDetails:  data.data.transaction_details
      }
      const addFundData = await saveNewWalletFundDetails(newAddFundData)
      return return res.status(200).json({ data: addFundData })
    }
  } catch (error) {
    const redirectUrl = `${FE_APP_BASE_URL}/payment?dynoPayment=${status === 'successful' ? PAYMENT_STATUS_SUCCESS : PAYMENT_STATUS_FAILURE}`
    const err = { message: 'Failed to purchase a new shipment', error: error?.response?.data?.error || error?.response?.data || error, paymentTrackId: meta_data.product }
    logger.error(err)
    return res.redirect(redirectUrl);
  }
}

module.exports = {
  addUserWalletDetails,
  addWalletFundsLink,
  getUserWalletBalance,
  getUserTransactions,
  getUserTransactionById,
  addFundWalletsHook
}
