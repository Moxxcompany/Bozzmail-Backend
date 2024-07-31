const { post } = require("../utils/axios")
const { TELEGRAM_BOT_TOKEN } = require("../constant/constants")
const { logger } = require("../utils/logger")

const sendTelegramSms = async ({ id, message }) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  try {
    const payload = {
      chat_id: id,
      text: message,
    }
    const response = await post(url, payload)
    return response.data
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message
    logger.error({ message: 'Failed to send message on telegram', error: errorMessage })
  }
}

module.exports = { sendTelegramSms }
