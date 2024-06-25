const { validationResult } = require('express-validator');

const validateError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsMsg = {}
    errors.errors.forEach(error => {
      errorsMsg[error.path] = error.msg
    });
    return res.status(400).json({ message: errorsMsg });
  }
  next();
}

module.exports = {
  validateError
};