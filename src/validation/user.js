const { body } = require('express-validator');
const { validateError } = require('../utils/validation')

const signupSchema = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/)
    .withMessage('Password must have min. 8 characters, mix of letters and numbers/special characters'),
  validateError
];

const signInSchema = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  validateError
];


module.exports = {
  signupSchema,
  signInSchema
};