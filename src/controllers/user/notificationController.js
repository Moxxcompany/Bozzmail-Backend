const {
  fetchUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
} = require("../../helper/sendNotification")

const getUserNotification = async (req, res) => {
  const id = req.userId
  const { limit, page } = req.query
  try {
    const notifications = await fetchUserNotifications(id, page, limit)
    res.status(200).json({ notifications })
  } catch (error) {
    res.status(error.status || 500).json({ message: error })
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
    res.status(error.status || 500).json({ message: error })
  }
}

const deleteUserNotifications = async (req, res) => {
  const id = req.userId
  const payload = req.body
  try {
    await deleteNotifications(id, payload.ids)
    res.status(200).json({ message: "Notifications deleted successfuly." })
  } catch (error) {
    res.status(error.status || 500).json({ message: error })
  }
}

module.exports = {
  getUserNotification,
  changeNotificationReadStatus,
  deleteUserNotifications,
}
