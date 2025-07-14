const {
  fetchUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
} = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")

const getUserNotification = async (req, res) => {
  const id = req.userId
  const { limit, page } = req.query
  try {
    const notifications = await fetchUserNotifications(id, page, limit)
    return res.status(200).json({ notifications })
  } catch (error) {
    const err = { message: 'Failed to fetch user notifications', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const changeNotificationReadStatus = async (req, res) => {
  const payload = req.body
  try {
    await markNotificationsAsRead(payload.ids)
    res
      .status(200)
      .json({ message: "Notifications marked as read successfuly." })
  } catch (error) {
    const err = { message: 'Failed to change notifications status', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const deleteUserNotifications = async (req, res) => {
  const id = req.userId
  const payload = req.body
  try {
    await deleteNotifications(id, payload.ids)
    return res.status(200).json({ message: "Notifications deleted successfuly." })
  } catch (error) {
    const err = { message: 'Failed to delete notifications', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

module.exports = {
  getUserNotification,
  changeNotificationReadStatus,
  deleteUserNotifications,
}
