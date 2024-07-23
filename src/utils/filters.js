const paginate = (page, limit) => {
  const validPage = page > 0 ? parseInt(page) : 1
  const validLimit = limit > 0 ? parseInt(limit) : 10
  const skip = (validPage - 1) * validLimit

  return {
    validPage,
    validLimit,
    skip,
  }
}

module.exports = {
  paginate,
}
