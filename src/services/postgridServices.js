const { post } = require("../utils/axios")
const {
  POSTGRID_API_KEY,
  POSTGRID_BASE_URL,
  SEND_MAIL_POSTCARD_TYPE,
  POSTGRID_SECRET_KEY,
} = require("../constant/constants")
const fs = require("fs")
const FormData = require('form-data')

const headers = {
  "x-api-key": POSTGRID_API_KEY,
}

const sendLetter = async (payload, userId, pdfFile) => {
  const url = `${POSTGRID_BASE_URL}/v1/letters`
  try {
    const formData = new FormData()

    formData.append("to[addressLine1]", payload.address_to.street1)
    formData.append("to[firstName]", payload.address_to.first_name)
    formData.append("to[lastName]", payload.address_to.last_name)
    formData.append("to[companyName]", payload.address_to.company_name)
    formData.append("to[city]", payload.address_to.city)
    formData.append("to[postalOrZip]", payload.address_to.zip)
    formData.append("to[provinceOrState]", payload.address_to.state)
    formData.append("to[countryCode]", payload.address_to.country)

    formData.append("from[addressLine1]", payload.address_from.street1)
    formData.append("from[firstName]", payload.address_from.first_name)
    formData.append("from[lastName]", payload.address_from.last_name)
    formData.append("from[companyName]", payload.address_from.company_name)
    formData.append("from[city]", payload.address_from.city)
    formData.append("from[postalOrZip]", payload.address_from.zip)
    formData.append("from[provinceOrState]", payload.address_from.state)
    formData.append("from[countryCode]", payload.address_from.country)

    formData.append("addressPlacement", payload.addressPlacement) // top_first_page or insert_blank_page
    formData.append("doubleSided", payload.doubleSided)
    formData.append("perforatedPage", payload.perforatedPage) // 1 or 0
    formData.append("extraService", payload.extraService)
    formData.append("envelopeType", payload.envelopeType || "flat")
    formData.append("size", payload.size)
    formData.append("mailingClass", payload.mailingClass)
    formData.append("sendDate", payload.sendDate)
    formData.append("description", payload.description)
    formData.append("metadata[userId]", userId)

    if (payload?.color) {
      formData.append("color", payload.color) // true or false
    }
    if (payload?.express) {
      formData.append("express", payload.express) // true or false
    }
    if (pdfFile) {
      formData.append("pdf", fs.createReadStream(pdfFile.path), { filename: pdfFile.originalname })
    } else if (payload.pdfLink) {
      formData.append("pdfLink", payload.pdfLink)
    } else {
      formData.append("html", payload.html)
    }
    return await post(url, formData, null, { ...headers, ...formData.getHeaders() })
  } catch (error) {
    throw error
  }
}

const sendPostCard = async (payload, userId, pdfFile) => {
  const url = `${POSTGRID_BASE_URL}/v1/postcards`
  try {
    const formData = new FormData()
    formData.append("to[addressLine1]", payload.address_to.street1)
    formData.append("to[firstName]", payload.address_to.first_name)
    formData.append("to[lastName]", payload.address_to.last_name)
    formData.append("to[companyName]", payload.address_to.company_name)
    formData.append("to[city]", payload.address_to.city)
    formData.append("to[postalOrZip]", payload.address_to.zip)
    formData.append("to[provinceOrState]", payload.address_to.state)
    formData.append("to[countryCode]", payload.address_to.country)

    formData.append("size", payload?.size)
    formData.append("sendDate", payload.sendDate)
    formData.append("description", payload.description)
    formData.append("mailingClass", payload.mailingClass)
    formData.append("metadata[userId]", userId)
    if (payload?.express) {
      formData.append("express", payload.express) // true or false
    }
    if (pdfFile) {
      formData.append("pdf", fs.createReadStream(pdfFile.path), { filename: pdfFile.originalname })
    } else if (payload.pdfLink) {
      formData.append("pdf", payload.pdfLink)
    } else {
      formData.append("frontHTML", payload.frontHTML)
      formData.append("backHTML", payload.backHTML)
    }
    return await post(url, formData, null, { ...headers, ...formData.getHeaders() })
  } catch (error) {
    throw error
  }
}

const cancelMail = async (payload, mailData) => {
  const url = `${POSTGRID_BASE_URL}/v1/${mailData.mailType === SEND_MAIL_POSTCARD_TYPE ? "postcards" : "letters"
    }/${mailData.mailId}/cancellation`
  try {
    const data = {
      note: payload.note,
    }
    return await post(url, data, null, headers)
  } catch (error) {
    throw error
  }
}

const createWebHook = async (payload, userId) => {
  const url = `${POSTGRID_BASE_URL}/v1/webhooks`
  try {
    const data = {
      enabledEvents: [
        "letter.created",
        "letter.updated",
        "postcard.created",
        "postcard.updated",
      ],
      url: payload.url,
      secret: POSTGRID_SECRET_KEY,
    }
    return await post(url, data, null, headers)
  } catch (error) {
    throw error
  }
}

module.exports = {
  sendPostGridLetter: sendLetter,
  sendPostGridPostCard: sendPostCard,
  createPostGridWebHook: createWebHook,
  cancelPostGridMail: cancelMail,
}
