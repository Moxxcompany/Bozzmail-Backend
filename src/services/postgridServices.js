const { post } = require('../utils/axios')
const {
  POSTGRID_API_KEY,
  POSTGRID_BASE_URL,
  SEND_MAIL_POSTCARD_TYPE,
} = require('../constant/constants')

const headers = {
  'x-api-key': POSTGRID_API_KEY
}

const sendLetter = async (payload, userId) => {
  const url = `${POSTGRID_BASE_URL}/v1/letters`
  try {
    const data = {
      to: {
        addressLine1: payload.address_to.street1,
        firstName: payload.address_to.first_name,
        lastName: payload.address_to.last_name,
        companyName: payload.address_to.company_name,
        city: payload.address_to.city,
        postalOrZip: payload.address_to.zip,
        provinceOrState: payload.address_to.state,
        countryCode: payload.address_to.country,
      },
      from: {
        addressLine1: payload.address_from.street1,
        firstName: payload.address_from.first_name,
        lastName: payload.address_from.last_name,
        companyName: payload.address_from.company_name,
        city: payload.address_from.city,
        postalOrZip: payload.address_from.zip,
        provinceOrState: payload.address_from.state,
        countryCode: payload.address_from.country,
      },
      html: payload.html,
      addressPlacement: payload.addressPlacement,  // top_first_page or insert_blank_page
      doubleSided: payload.doubleSided,
      perforatedPage: payload.perforatedPage, // 1 or 0
      extraService: payload.extraService,
      envelopeType: payload.envelopeType || 'flat',
      description: payload.description,
      metadata: {
        userId: userId,
      }
    };
    return await post(url, data, null, headers)
  } catch (error) {
    throw error;
  }
}

const sendPostCard = async (payload, userId) => {
  const url = `${POSTGRID_BASE_URL}/v1/postcards`
  try {
    const data = {
      to: {
        addressLine1: payload.address_to.street1,
        firstName: payload.address_to.first_name,
        lastName: payload.address_to.last_name,
        companyName: payload.address_to.company_name,
        city: payload.address_to.city,
        postalOrZip: payload.address_to.zip,
        provinceOrState: payload.address_to.state,
        countryCode: payload.address_to.country,
      },
      frontHTML: payload.frontHTML,
      backHTML: payload.backHTML,
      size: payload.size,
      description: payload.description,
      metadata: {
        userId: userId,
      }
    };
    return await post(url, data, null, headers)
  } catch (error) {
    throw error;
  }
}

const cancelMail = async (payload, mailData) => {
  const url = `${POSTGRID_BASE_URL}/v1/${mailData.mailType === SEND_MAIL_POSTCARD_TYPE ? 'postcards' : 'letters'}/${mailData.mailId}/cancellation`
  try {
    const data = {
      note: payload.note
    };
    return await post(url, data, null, headers)
  } catch (error) {
    throw error;
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
        "postcard.updated"
      ],
      url: payload.url,
      metadata: {
        userId: userId,
      }
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
};
