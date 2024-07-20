const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constant/constants');
const { fetchUserById } = require('../helper/user');

module.exports = async function (req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    const userDetails = await fetchUserById(decoded.userId)
    if (!userDetails || !userDetails.is_active) {
      return res.status(401).json({ message: 'Token not valid' });
    }
    req.userDetails = userDetails
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
