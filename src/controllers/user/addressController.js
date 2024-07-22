const {
  createNewAddress,
  getUserAddresses,
  getAddressById,
  deleteAddress,
  updateAddress,
  validateAddress
} = require('../../helper/addressBook');
const csvParser = require('csv-parser');
const fs = require('fs');
const { sendNotification } = require('../../helper/sendNotification');

const generateNewAddress = async (req, res) => {
  const payload = req.body;
  const userId = req.userId;
  try {
    payload.userId = userId
    const newAddress = await createNewAddress(payload)
    if (newAddress) {
      await sendNotification({
        user: req.userDetails,
        message: 'Your address generated succesfully.',
        emailMessage: `<p>Your address generated succesfully</p>`,
        emailSubject: 'Address'
      })
      return res.status(200).json({ data: newAddress })
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
};

const fetchUserAddresses = async (req, res) => {
  const userId = req.userId;
  const { limit, page } = req.query;
  try {
    const addresses = await getUserAddresses(userId, limit, page);
    res.status(200).json({ data: addresses })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const fetchAddressById = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const address = await getAddressById(id, userId);
    res.status(200).json({ data: address })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const deleteUserAddress = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const address = await deleteAddress(userId, id);
    if (address) {
      res.status(200).json({ message: 'Address deleted successfully.' })
    } else {
      return res.status(400).json({ message: 'Address data not found. Please check again.' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const editUserAddressData = async (req, res) => {
  const userId = req.userId
  const id = req.params.id
  const payload = req.body;
  try {
    const address = await getAddressById(id, userId);
    if (!address) {
      return res.status(400).json({ message: 'HS code data not found. Please check again.' });
    }
    const newAddress = await updateAddress(userId, id, payload)
    if (newAddress) {
      await sendNotification({
        user: req.userDetails,
        message: 'Address data updated succesfully.',
        emailMessage: `<p>Address data updated succesfully.</p>`,
        emailSubject: 'Address updated'
      })
      return res.status(200).json({ message: 'Address data updated succesfully.', data: newAddress })
    } else {
      return res.status(500).json({ message: 'Failed to update Address data' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const verifyAddress = async (req, res) => {
  const payload = req.body;
  try {
    const response = await validateAddress(payload);
    if (response) {
      await sendNotification({
        user: req.userDetails,
        message: 'Address verified succesfully.',
        emailMessage: `<p>Address verified succesfully.</p>`,
        emailSubject: 'Address verification'
      })
      return res.status(200).json({ data: response.data })
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const importAddresses = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const userId = req.userId
        const addresses = []
        for (const result of results) {
          if (Object.keys(result).length) {
            const addressData = {
              userId: userId,
              street1: result.street1,
              street2: result.street2,
              city: result.city,
              state: result.state,
              country: result.country,
              postalCode: result.postalCode,
              name: result.name,
              email: result.email,
              phoneNumber: result.phoneNumber,
              is_default: result.is_default === 'true'
            };
            const newAddress = await createNewAddress(addressData)
            addresses.push(newAddress)
          }
        }
        await sendNotification({
          user: req.userDetails,
          message: 'Addresses imported successfully.',
          emailMessage: `<p>Addresses imported successfully.</p>`,
          emailSubject: 'Address'
        })
        res.status(200).json({ message: 'Addresses imported successfully', data: addresses });
      } catch (error) {
        res.status(500).json({ message: 'Error importing addresses', error });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    });
}

module.exports = {
  generateNewAddress,
  fetchUserAddresses,
  fetchAddressById,
  deleteUserAddress,
  editUserAddressData,
  verifyAddress,
  importAddresses
};
