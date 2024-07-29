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
    res.status(200).json({ notifications })
  } catch (error) {
    const err = error || 'Error fetching notification list for user'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
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
    const err = error || 'Error changing notification status for user'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const deleteUserNotifications = async (req, res) => {
  const id = req.userId
  const payload = req.body
  try {
    await deleteNotifications(id, payload.ids)
    res.status(200).json({ message: "Notifications deleted successfuly." })
  } catch (error) {
    const err = error || 'Error deleting notifications for user'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

module.exports = {
  getUserNotification,
  changeNotificationReadStatus,
  deleteUserNotifications,
}
