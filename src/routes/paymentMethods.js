const express = require('express')
const router = express.Router()
const {
  getUserPaymentMethods,
  addUserPaymentMethod,
  updateUserPaymentMethod,
  deletePaymentMethod
} = require('../controllers/user/paymentMethodsController')

const {
  paymentMethodValidation
} = require('../validation/user')

router.get("/:userId", getUserPaymentMethods)
router.post("/:userId", paymentMethodValidation, addUserPaymentMethod);
router.post("/:userId/:paymentMethodId", paymentMethodValidation, updateUserPaymentMethod);
router.delete("/:userId/:paymentMethodId", deletePaymentMethod);

module.exports = router;