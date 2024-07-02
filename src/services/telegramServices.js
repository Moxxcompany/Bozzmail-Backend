const { post } = require('../utils/axios')
const {
  TELEGRAM_BOT_TOKEN
} = require('../constant/constants')

const sendTelegramSms = async ({ id, message }) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const payload = {
      chat_id: id,
      text: message
    }
    const response = await post(url, payload)
    return response.data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    const errorStatus = error.response ? error.response.status : 500;
    throw { errors: errorMessage.errors, status: errorStatus };
  }
};

module.exports = { sendTelegramSms };
