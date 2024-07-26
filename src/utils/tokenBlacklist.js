const jwtBlacklist = new Set();

const addTokenToBlacklist = (token) => {
  jwtBlacklist.add(token);
};

const isTokenBlacklisted = (token) => {
  return jwtBlacklist.has(token);
};

module.exports = {
  addTokenToBlacklist,
  isTokenBlacklisted,
};
