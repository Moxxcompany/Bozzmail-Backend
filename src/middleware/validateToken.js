const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constant/constants')

module.exports = function (req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
