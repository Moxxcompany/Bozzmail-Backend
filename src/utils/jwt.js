const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY

const createToken = (id) => {
  const token = jwt.sign({ userId: id }, jwtSecret, { expiresIn: 3600 });
  return token
}

module.exports = {
  createToken
}