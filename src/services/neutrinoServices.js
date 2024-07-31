const { post } = require("../utils/axios")
const { NEUTRINO_API_KEY, NEUTRINO_BASE_URL, NEUTRINO_USER_ID } = require("../constant/constants")
const headers = {
  'User-ID': NEUTRINO_USER_ID,
  'API-Key': NEUTRINO_API_KEY
}
const { logger } = require("../utils/logger")

const verifyEmailId = async (emailId) => {
  const url = `${NEUTRINO_BASE_URL}/email-verify`
  try {
    const payload = {
      email: emailId,
      'fix-typos': false
    }
    const { data } = await post(url, payload, null, headers)
    if (
      data &&
      data.verified &&
      data.valid &&
      !data['is-disposable'] &&
      data['domain-status'] == 'ok' &&
      data['smtp-status'] == 'ok'
    ) {
      return data
    } else {
      logger.error({ message: 'Email rejected', error: data })
      return false
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  verifyEmailUsingNeutrino: verifyEmailId
}
