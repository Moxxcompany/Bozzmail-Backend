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

const changePasswordSchema = [
  body('currentPassword').not().isEmpty().withMessage('Current Password is wrong'),
  validateNewPassword('newPassword'),
  validateError
]


module.exports = {
  signupValidations,
  emailRequired,
  changePasswordSchema,
  resetPasswordValidations
};