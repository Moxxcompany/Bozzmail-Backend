const { verifyToken } = require("../utils/jwt")
const { fetchUserById } = require("../helper/user");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

module.exports = async function (req, res, next) {
  const token = req.headers.token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is invalid' });
  }

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.userId
    const userDetails = await fetchUserById(decoded.userId)
    if (!userDetails || !userDetails.is_active) {
      return res.status(401).json({ message: "Token not valid" })
    }
    if (req.baseUrl === '/admin' && !userDetails.is_admin) {
      return res.status(401).json({ message: "You dont have authorization." })
    }
    req.userDetails = userDetails
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" })
  }
}
