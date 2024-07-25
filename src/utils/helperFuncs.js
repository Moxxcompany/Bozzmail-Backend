const generateUniqueNumber = (numLength) => {
  let length = numLength ? numLength : 12
  let randomNum = Math.random().toString().substring(2)
  while (randomNum.length < length) {
    randomNum += Math.floor(Math.random() * 10).toString()
  }
  randomNum = randomNum.substring(0, length)
  return randomNum
}

module.exports = {
  generateUniqueNumber
}
