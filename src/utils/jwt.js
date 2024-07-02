const jwt = require('jsonwebtoken');
const { 
  JWT_TOKEN_EXPIRE_TIME,
  JWT_SECRET_KEY
} = require('../constant/constants');

const createToken = (id) => {
  const token = jwt.sign({ userId: id }, JWT_SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRE_TIME });
  return token
}

module.exports = {
  createToken
}