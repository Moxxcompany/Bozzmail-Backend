const generate12DigitNumber = () => {
  let randomNum = Math.random().toString().substring(2)
  while (randomNum.length < 12) {
    randomNum += Math.floor(Math.random() * 10).toString()
  }
  randomNum = randomNum.substring(0, 12)
  return randomNum
}

module.exports = {
  generate12DigitNumber
}
