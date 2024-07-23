const { body, validationResult } = require("express-validator")

const validateError = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let errorsMsg = {}
    errors.errors.forEach((error) => {
      errorsMsg[error.path] = error.msg
    })
    return res.status(400).json({ message: errorsMsg })
  }
  next()
}

const validateNewPassword = (key) => {
  return body(key)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must have min. 8 characters, mix of letters and numbers/special characters"
    )
}

module.exports = {
  validateError,
  validateNewPassword,
}
