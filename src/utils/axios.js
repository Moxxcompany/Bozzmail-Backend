const axios = require("axios")
const { logger } = require("./logger")

const post = async (url, payload, token, headers) => {
  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      timeout: 30000, // 30 second timeout
    })
    return response
  } catch (error) {
    logger.error(`POST request failed to ${url}: ${error.message}`)
    throw error
  }
}

const get = async (url, token, headers) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers
      },
      timeout: 30000, // 30 second timeout
    })
    return response
  } catch (error) {
    logger.error(`GET request failed to ${url}: ${error.message}`)
    throw error
  }
}

module.exports = { post, get }
