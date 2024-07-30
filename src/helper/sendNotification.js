const NotificationMessage = require("../model/notificationMessage")
const { sendSMS } = require("../services/telynxServices")
const { sendTelegramSms } = require("../services/telegramServices")
const { sendMail } = require("../utils/sendEmail")
const { paginate } = require("../utils/filters")

const sendNotification = async ({
  user,
  message,
  emailMessage,
  emailSubject,
}) => {
  try {
    // const userId = mongoose.Types.ObjectId(user._id)
    let data = {
      userId: user._id,
      message: message,
    }
    await NotificationMessage(data).save()
    if (user.telegramId) {
      await sendTelegramSms({
        id: user.telegramId,
        message: message,
      })
    } else {
      if (emailMessage && user.email && user.notify_email) {
        await sendMail({
          subject: emailSubject,
          text: message,
          content: emailMessage,
          user: user
        })
      }
      if (user.notify_mobile && user.phoneNumber) {
        await sendSMS({
          phoneNumber: user.phoneNumber,
          message: message,
        })
      }
    }
  } catch (error) {
    throw error
  }
}

const fetchUserNotifications = async (userId, page, limit) => {
  try {
    const query = {}
    query.userId = userId
    const totalDocuments = await NotificationMessage.countDocuments(query)
    if (!limit && !page) {
      return {
        data: await NotificationMessage.find(query).sort({ created_at: -1 }),
        total: totalDocuments,
      }
    }
    const { validLimit, skip } = paginate(page, limit)
    const limitedData = await NotificationMessage.find(query)
      .skip(skip)
      .limit(validLimit)
      .sort({ created_at: -1 })
    return {
      total: totalDocuments,
      data: limitedData,
    }
  } catch (error) {
    throw error
  }
}

const markNotificationsAsRead = async (ids) => {
  try {
    return await NotificationMessage.updateMany(
      { _id: { $in: ids } },
      { $set: { is_read: true } }
    )
  } catch (error) {
    throw error
  }
}

const deleteNotifications = async (userId, ids) => {
  try {
    return await NotificationMessage.deleteMany({
      _id: { $in: ids },
      userId: userId,
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  sendNotification,
  fetchUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
}
