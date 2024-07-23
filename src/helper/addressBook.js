const AddressBook = require("../model/addressBook")
const { post } = require('../utils/axios')
const {
  GOOGLE_ADDRESS_VALIDATION_BASE_URL,
  GOOGLE_ADDRESS_VALIDATION_KEY
} = require("../constant/constants");
const { paginate } = require("../utils/filters");

const createNewAddress = async (data) => {
  try {
    const address = new AddressBook(data);
    if (data.is_default) {
      await AddressBook.updateMany(
        { userId: data.userId },
        { is_default: false }
      )
    }
    return await address.save();
  } catch (error) {
    throw error
  }
}

const getUserAddresses = async (userId, limit, page) => {
  try {
    const query = {}
    query.userId = userId
    if (!limit && !page) {
      return await AddressBook.find(query)
    }
    const totalDocuments = await AddressBook.countDocuments(query);
    const { validLimit, skip, validPage } = paginate(page, limit)
    const data = await AddressBook.find(query)
      .limit(validLimit)
      .skip(skip)
    return {
      total: totalDocuments,
      data: data,
      page: validPage,
      limit: validLimit
    };
  } catch (error) {
    throw error
  }
}

const getAddressById = async (_id, userId) => {
  try {
    return await AddressBook.findOne({ _id, userId });
  } catch (error) {
    throw error
  }
}

const deleteAddress = async (userId, _id) => {
  try {
    return await AddressBook.findOneAndDelete({ userId, _id })
  } catch (error) {
    throw error
  }
}

const updateAddress = async (userId, id, payload) => {
  try {
    let data = {}
    for (const key in payload) {
      if (payload[key] && payload[key].length) {
        data[key] = payload[key]
      }
    }
    if (payload.is_default) {
      data.is_default = payload.is_default
      await AddressBook.updateMany(
        { userId: data.userId },
        { is_default: false }
      )
    } else {
      data.is_default = false
    }
    return await AddressBook.findOneAndUpdate(
      { _id: id, userId },
      { $set: data }
    );
  } catch (error) {
    throw error
  }
}

const validateAddress = async (payload) => {
  try {
    const url = `${GOOGLE_ADDRESS_VALIDATION_BASE_URL}/v1:validateAddress?key=${GOOGLE_ADDRESS_VALIDATION_KEY}`
    let data = {
      address: {
        regionCode: payload.country,
        locality: payload.city,
        administrativeArea: payload.state,
        addressLines: [
          payload.street1
        ]
      }
    }
    if (payload.street2 && payload.street2.length) {
      data.address.addressLines.push(payload.street2)
    }
    return await post(url, data)
  } catch (error) {
    throw error
  }
}

module.exports = {
  createNewAddress,
  getUserAddresses,
  getAddressById,
  deleteAddress,
  updateAddress,
  validateAddress
}