const { fetchUserById } = require("../../helper/user")
const { sendNotification } = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")
const { 
  registerUserForPayment, 
  generatePaymentLink, 
  generateAddFundsLink,
  fetchDynoWalletBalance,
  fetchUserTransactions,
  fetchUserTransactionById
} = require("../../services/dynoPayServices")

const addUserWalletDetails = async (req, res) => {
  const { email, name, mobile } = req.body
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (userDetails.walletToken) {
      return res.status(400).json({ message: "User already activated wallet" })
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
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
    return res.status(200).json({ message: 'You have successfully activated your wallet.' })
  } catch (error) {
    const err = { message: "Failed to activate user wallet", error: error.data }
    logger.error(err)
    res.status(error.status || 500).json(err)
  }
}

const addWalletFundsLink = async (req, res) => {
  const { amount, redirect_url } = req.body
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }
    if (!amount || !redirect_url) {
      return res.status(400).json({ message: "Amount and redirect URL are required" })
    }

    const { data } = await generateAddFundsLink(amount, redirect_url, userDetails.walletToken)
    if (data && data.data) {
      return res.status(200).json({ message: 'Your link to add funds', data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to create link to add funds", error: error?.data || error }
    logger.error(err)
    res.status(500).json(err)
  }
}

const getUserWalletBalance = async (req, res) => {
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchDynoWalletBalance(userDetails.walletToken)
    if (data && data.data) {
      return res.status(200).json({ message: 'Your dynopay wallet balance is fetched successfully', data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch wallet Balance", error: error?.data || error }
    logger.error(err)
    res.status(500).json(err)
  }
}

const getUserTransactions = async (req, res) => {
  const userId = req.userId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchUserTransactions(userDetails.walletToken)
    if (data && data.data) {
      return res.status(200).json({ data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch user transactions", error: error?.data || error }
    logger.error(err)
    res.status(500).json(err)
  }
}

const getUserTransactionById = async (req, res) => {
  const userId = req.userId
  const transactionId = req.params.transactionId
  try {
    const userDetails = await fetchUserById(userId, true)
    if (!userDetails.walletToken) {
      return res.status(400).json({ message: "User have to first activate dynopay Wallet" })
    }

    const { data } = await fetchUserTransactionById(userDetails.walletToken, transactionId)
    if (data && data.data) {
      return res.status(200).json({ data: data.data })
    }
  } catch (error) {
    const err = { message: "Failed to fetch transaction details", error: error?.data || error }
    logger.error(err)
    res.status(500).json(err)
  }
}

module.exports = {
  addUserWalletDetails,
  addWalletFundsLink,
  getUserWalletBalance,
  getUserTransactions,
  getUserTransactionById
}
