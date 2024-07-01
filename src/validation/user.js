const { body } = require('express-validator');
const { validateError, validateNewPassword } = require('../utils/validation')

const signupValidations = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  validateNewPassword('password'),
  validateError
];

const emailRequired = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  validateError
];

const resetPasswordValidations = [
  body('token').not().isEmpty().withMessage('Reset Token is required'),
  validateNewPassword('newPassword'),
  validateError
]

const changePasswordValidations = [
  body('currentPassword').not().isEmpty().withMessage('Current Password is wrong'),
  validateNewPassword('newPassword'),
  validateError
]

const paymentMethodValidation = [
  body('cardholderName').not().isEmpty().withMessage('Card holder Name is required'),
  body('cardNumber').not().isEmpty().withMessage('Card Number is required'),
  body('expiryDate').not().isEmpty().withMessage('Card Expiry Date is required'),
  body('cvv').not().isEmpty().withMessage('Card cvv number is required'),
  validateError
];

const telegramSignUpValidations = [
  body('first_name').not().isEmpty().withMessage('First Name is required'),
  body('last_name').not().isEmpty().withMessage('Last Name is required'),
  body('id').not().isEmpty().withMessage('Telegram ID is required'),
  validateError
]

module.exports = {
  signupValidations,
  emailRequired,
  changePasswordValidations,
  resetPasswordValidations,
  paymentMethodValidation,
  telegramSignUpValidations
};