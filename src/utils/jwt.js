const jwt = require('jsonwebtoken');
const { JWT_TOKEN_EXPIRE_TIME } = require('../constant/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

if (
  !JWT_SECRET_KEY 
) {
  throw new Error('Environment variables for jwt authentication are not set.');
}

const createToken = (id) => {
  const token = jwt.sign({ userId: id }, JWT_SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRE_TIME });
  return token
}

module.exports = {
  createToken
}