const { post } = require("../utils/axios")
const { NEUTRINO_API_KEY, NEUTRINO_BASE_URL, NEUTRINO_USER_ID } = require("../constant/constants")
const headers = {
  'User-ID': NEUTRINO_USER_ID,
  'API-Key': NEUTRINO_API_KEY
}

const verifyEmailId = async (emailId) => {
  const url = `${NEUTRINO_BASE_URL}/email-validate`
  try {
    const payload = {
      email: emailId,
      'fix-typos': false
    }
    const response = await post(url, payload, null, headers)
    return response.data
  } catch (error) {
    throw error
  }
}

module.exports = {
  verifyEmailUsingNeutrino: verifyEmailId
}
