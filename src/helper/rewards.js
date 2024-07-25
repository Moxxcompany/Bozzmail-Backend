const RewardPoint = require("../model/rewardPoints")

const addUserRewardPoints = async (data) => {
  try {
    return await RewardPoint(data).save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  addUserRewardPoints
}
