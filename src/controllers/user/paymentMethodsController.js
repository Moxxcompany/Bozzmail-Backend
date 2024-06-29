const {
  fetchUserPaymentMethods,
  createUserNewPaymentMethod,
  getPaymentMethodById
} = require('../../helper/paymentMethods')
const {
  fetchUserById
} = require('../../helper/user')

const getUserPaymentMethods = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    const payments = await fetchUserPaymentMethods(id);
    res.status(200).json({ data: payments })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const addUserPaymentMethod = async (req, res) => {
  const { cardholderName, cardNumber, expiryDate, cvv, isDefault } = req.body;
  const id = req.params.userId;
  const user = await fetchUserById(id);
  if (!user) {
    return res.status(400).json({ message: { error: 'User Not found. Check again' } });
  }
  const paymentMethod = {
    userId: user._id,
    cardholderName,
    cardNumber,
    expiryDate,
    cvv,
    isDefault
  };
  try {
    const newPaymentMethod = await createUserNewPaymentMethod(paymentMethod);
    res.status(201).json({ message: 'New Payment Method added successfuly', data: newPaymentMethod });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const updateUserPaymentMethod = async (req, res) => {
  const { cardholderName, cardNumber, expiryDate, cvv, isDefault } = req.body;
  const userId = req.params.userId;
  const paymentMethodId = req.params.paymentMethodId;
  try {
    const paymentMethod = await getPaymentMethodById(paymentMethodId, userId);
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method not found' });
    }
    paymentMethod.cardholderName = cardholderName ?? paymentMethod.cardholderName;
    paymentMethod.cardNumber = cardNumber ?? paymentMethod.cardNumber;
    paymentMethod.expiryDate = expiryDate ?? paymentMethod.expiryDate;
    paymentMethod.cvv = cvv ?? paymentMethod.cvv;
    paymentMethod.isDefault = isDefault ?? paymentMethod.isDefault;
    const updatedPaymentMethod = await paymentMethod.save();
    res.status(201).json({ message: 'Payment Method updated successfuly', data: updatedPaymentMethod });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const deletePaymentMethod = async (req, res) => {
  const userId = req.params.userId;
  const paymentMethodId = req.params.paymentMethodId;
  try {
    const paymentMethod = await getPaymentMethodById(paymentMethodId, userId);
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method not found' });
    }
    await paymentMethod.remove();
    res.status(201).json({ message: 'Payment Method deleted successfuly'});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getUserPaymentMethods,
  addUserPaymentMethod,
  updateUserPaymentMethod,
  deletePaymentMethod
};
