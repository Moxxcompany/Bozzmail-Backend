const { sendNotification } = require("../../helper/sendNotification")
const { fetchShipmentData } = require("../../helper/shipment")
const {
  fetchUsersList,
  fetchUserById,
  fetchUserByPhoneNumber
} = require("../../helper/user")
const { verifyPhoneNumberUsingHlrLookup } = require("../../services/hlrLookupservices")
const { logger } = require("../../utils/logger")

const getUserList = async (req, res) => {
  const { limit, page, isActive } = req.query
  try {
    const users = await fetchUsersList(limit, page, isActive)
    return res.status(200).json({ users })
  } catch (error) {
    const err = { message: 'Failed to fetch user list for admin', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const getUserById = async (req, res) => {
  const id = req.params.id
  try {
    const user = await fetchUserById(id)
    return res.status(200).json({ data: user })
  } catch (error) {
    const err = { message: 'Failed to fetch user details for admin', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const updateUserDetails = async (req, res) => {
  const userId = req.params.id
  const { fullName, phoneNumber, address } = req.body
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return return res.status(400).json({ message: "User not found. Check again" })
    }
    if (phoneNumber && phoneNumber.length) {
      const checkUserWithPhoneNum = await fetchUserByPhoneNumber(phoneNumber)
      if (checkUserWithPhoneNum && checkUserWithPhoneNum._id != user._id) {
        return return res.status(400).json({ message: "Phone Number already in use" })
      }
      const phoneVerification = await verifyPhoneNumberUsingHlrLookup(phoneNumber)
      if (!phoneVerification) {
        return return res.status(400).json({ message: "Phone Number is not valid" })
      }
    }
    user.fullName = fullName ? fullName : user.fullName
    user.phoneNumber = phoneNumber && phoneNumber.length ? phoneNumber : user.phoneNumber
    user.address = address ? address : user.address
    await user.save()
    await sendNotification({
      user: user,
      message: "Your account has been updated by admin.",
      emailMessage: `<p>Your bozzmail account has been updated by admin.</p>`,
      emailSubject: "Bozzmail account updated",
    })
    return res.status(200).json({ message: "User details updated successfully" })
  } catch (error) {
    const err = { message: 'Failed to update user details by admin', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const deleteUserById = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await fetchUserById(userId)
    if (!user && !user.is_active) {
      return return res.status(400).json({ message: "User not found. Check again" })
    }
    user.is_active = false
    await user.save()
    await sendNotification({
      user: user,
      message: "Your account has been deactivated by admin.",
      emailMessage: `<p>Your bozzmail account has been deactivated by admin.</p>`,
      emailSubject: "Bozzmail account deactivation",
    })
    return res.status(200).json({ message: "User data Deleted Successfully" })
  } catch (error) {
    const err = { message: 'Failed to delete user by admin', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const fetchAllShipments = async (req, res) => {
  const { limit, page } = req.query
  try {
    const shipments = await fetchShipmentData(null, page, limit)
    return res.status(200).json({ shipments })
  } catch (error) {
    const err = { message: 'Failed to fetch shipment list for admin', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

module.exports = {
  getUserList,
  getUserById,
  updateUserDetails,
  deleteUserById,
  fetchAllShipments
}
