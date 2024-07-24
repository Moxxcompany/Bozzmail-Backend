const RewardPoint = require("../model/rewardPoints")

const addUserPoints = async (data) => {
  try {
    return await RewardPoint(data).save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  addUserPoints
}
