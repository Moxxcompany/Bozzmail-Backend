const { post } = require("../utils/axios")
const { HLR_LOOKUP_API_KEY, HLR_LOOKUP_BASE_URL, HLR_LOOKUP_API_SECRET } = require("../constant/constants")
const { logger } = require("../utils/logger")

const rejectedTelephoneNumberType = [
  "VOIP",
  "UNKNOWN",
  "BAD_FORMAT"
]

const verifyPhoneNumber = async (phonenumber) => {
  const url = `${HLR_LOOKUP_BASE_URL}/apiv2/hlr`
  try {
    const payload = {
      "api_key": HLR_LOOKUP_API_KEY,
      "api_secret": HLR_LOOKUP_API_SECRET,
      "requests": [
        {
          "telephone_number": phonenumber
        }
      ]
    }
    const { data } = await post(url, payload)
    if (
      data &&
      data.results &&
      data.results.length &&
      data.results[0].error == "NONE" &&
      data.results[0]['detected_telephone_number'] &&
      data.results[0]['current_network'] == 'AVAILABLE' &&
      !rejectedTelephoneNumberType.includes(data.results[0]['telephone_number_type'])
    ) {
      return data.results[0]
    } else {
      logger.error({ message: 'Phone Number rejected', error: data.results || data })
      return false
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  verifyPhoneNumberUsingHlrLookup: verifyPhoneNumber
}
