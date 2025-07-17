const { fetchUserById } = require("../../helper/user")
const { fetchShipmentData } = require("../../helper/shipment")
const { fetchUserTransactions } = require("../../services/dynoPayServices")
const { fetchUserAddresses } = require("../../helper/addressBook")
const { logger } = require("../../utils/logger")

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  const userId = req.userId
  try {
    // Get user shipments
    const shipments = await fetchShipmentData(userId, 1, 1000) // Get all shipments for stats
    
    // Get user transactions
    const transactions = await fetchUserTransactions(userId)
    
    // Get user addresses (saved contacts)
    const addresses = await fetchUserAddresses(userId)
    
    // Calculate statistics
    const totalLabels = shipments?.total || 0
    const inTransit = shipments?.data?.filter(s => s.status === 'in_transit').length || 0
    
    // Calculate monthly spend
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlySpend = transactions?.data?.filter(transaction => {
      const transactionDate = new Date(transaction.created_at)
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.status === 'successful'
    }).reduce((total, transaction) => total + (transaction.amount || 0), 0) || 0
    
    const savedContacts = addresses?.length || 0
    
    return res.status(200).json({
      data: {
        totalLabels,
        inTransit,
        monthlySpend,
        savedContacts
      }
    })
  } catch (error) {
    const err = { message: 'Failed to fetch dashboard statistics', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

// Get recent shipments
const getRecentShipments = async (req, res) => {
  const userId = req.userId
  const { limit = 5 } = req.query
  
  try {
    const shipments = await fetchShipmentData(userId, 1, parseInt(limit))
    
    return res.status(200).json({
      data: shipments?.data || [],
      total: shipments?.total || 0
    })
  } catch (error) {
    const err = { message: 'Failed to fetch recent shipments', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

// Get user profile summary
const getUserProfileSummary = async (req, res) => {
  const userId = req.userId
  
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    
    // Return only essential profile information
    const profileSummary = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      walletId: user.walletId,
      isActive: user.is_active
    }
    
    return res.status(200).json({
      data: profileSummary
    })
  } catch (error) {
    const err = { message: 'Failed to fetch user profile summary', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

module.exports = {
  getDashboardStats,
  getRecentShipments,
  getUserProfileSummary
} 