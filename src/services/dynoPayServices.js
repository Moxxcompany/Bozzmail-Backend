const { post, get } = require("../utils/axios")
const { DYNO_PAY_BASE_URL, DYNO_PAY_API_KEY } = require("../constant/constants")

const header = {
  "x-api-key": DYNO_PAY_API_KEY
}

const registerUserForPayment = async (email, name, mobile) => {
  const url = `${DYNO_PAY_BASE_URL}/createUser`
  try {
    const payload = {
      email: email,
      name: name
    }
    if (mobile) {
      payload.mobile = mobile
    }
    return await post(url, payload, null, header)
  } catch (error) {
    throw error.response
  }
}

const generatePaymentLink = async (amount, redirect_uri, meta_data, walletToken) => {
  const url = `${DYNO_PAY_BASE_URL}/createPayment`
  const token = `Bearer ${walletToken}`
  try {
    const payload = {
      amount,
      redirect_uri,
      meta_data
    }
    return await post(url, payload, token, header)
  } catch (error) {
    throw error.response
  }
}

const generateAddFundsLink = async (amount, redirect_uri, walletToken) => {
  const url = `${DYNO_PAY_BASE_URL}/addFunds`
  const token = `Bearer ${walletToken}`
  try {
    const payload = {
      amount,
      redirect_uri
    }
    return await post(url, payload, token, header)
  } catch (error) {
    throw error.response
  }
}

const fetchDynoWalletBalance = async (walletToken) => {
  const url = `${DYNO_PAY_BASE_URL}/getBalance`
  const token = `Bearer ${walletToken}`
  try {
    return await get(url, token, header)
  } catch (error) {
    throw error.response
  }
}

const fetchUserTransactions = async (walletToken) => {
  const url = `${DYNO_PAY_BASE_URL}/getTransactions`
  const token = `Bearer ${walletToken}`
  try {
    return await get(url, token, header)
  } catch (error) {
    throw error.response
  }
}

const fetchUserTransactionById = async (walletToken, transactionId) => {
  const url = `${DYNO_PAY_BASE_URL}/getSingleTransaction/${transactionId}`
  const token = `Bearer ${walletToken}`
  try {
    return await get(url, token, header)
  } catch (error) {
    throw error.response
  }
}

module.exports = {
  registerUserForPayment,
  generatePaymentLink,
  generateAddFundsLink,
  fetchDynoWalletBalance,
  fetchUserTransactions,
  fetchUserTransactionById
}
