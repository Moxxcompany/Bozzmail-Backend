const axios = require("axios")

const post = async (url, payload, token, headers) => {
  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
    })
    return response
  } catch (error) {
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
    })
    return response
  } catch (error) {
    throw error
  }
}

module.exports = { post, get }
