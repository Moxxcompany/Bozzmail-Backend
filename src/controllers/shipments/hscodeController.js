const {
  createNewHscode,
  findUserHscode,
  deleteHscodeDetail,
  findHscodeDetailsById,
} = require("../../helper/hscode")
const { sendNotification } = require("../../helper/sendNotification")
const { newHscode } = require("../../services/flavourclousServices")
const { logger } = require("../../utils/logger")

const generateNewHscode = async (req, res) => {
  const payload = req.body
  const userId = req.userId
  try {
    const response = await newHscode(payload)
    if (response.data) {
      let hscodeData = {
        userId: userId,
        hscodeDetails: response.data.Products[0].Classification,
        description: response.data.Products[0].Description,
        image: response.data.Products[0].Image,
        title: response.data.Products[0].Title,
      }
      const hscode = await createNewHscode(hscodeData)
      if (hscode) {
        await sendNotification({
          user: req.userDetails,
          message: "Your hs code genreated successfully",
          emailMessage: `<p>Your hs code genreated successfully.</p>`,
          emailSubject: "Your hashcode",
        })
        return res.status(200).json({ data: hscode })
      }
    } else {
      return res.status(500).json({ message: "Failed to create HS Code" })
    }
  } catch (error) {
    const err = error?.response?.data?.error || error?.response?.data || 'Error creating a new HS code'
    logger.error({ message: 'Failed to create HS code', error: err})
    res.status(error.status || 500).json({ message: err })
  }
}

const fetchUserHscode = async (req, res) => {
  const userId = req.userId
  const { page, limit } = req.query
  try {
    const hscodeData = await findUserHscode(userId, page, limit)
    res.status(200).json({ hscodeData })
  } catch (error) {
    const err = error || 'Error fetching user HS code list'
    logger.error({ message: 'Failed to fetch HS code list', error: err})
    res.status(error.status || 500).json({ message: err })
  }
}

const deleteHscodeData = async (req, res) => {
  const userId = req.userId
  const hscodeId = req.params.hscodeId
  try {
    const hscodeData = await deleteHscodeDetail(userId, hscodeId)
    if (!hscodeData) {
      return res
        .status(400)
        .json({ message: "HS code data not found. Please check again." })
    }
    await sendNotification({
      user: req.userDetails,
      message: "HS Code data deleted succesfully.",
      emailMessage: `<p>HS Code data deleted succesfully.</p>`,
      emailSubject: "Hs code",
    })
    res.status(200).json({ message: "HS Code data deleted succesfully." })
  } catch (error) {
    const err = error || 'Error deleting user HS code.'
    logger.error({ message: 'Failed to delete HS code', error: err })
    res.status(error.status || 500).json({ message: err })
  }
}

const editHscodeData = async (req, res) => {
  const userId = req.userId
  const hscodeId = req.params.hscodeId
  const payload = req.body
  try {
    const hscodeData = await findHscodeDetailsById(userId, hscodeId)
    if (!hscodeData) {
      return res
        .status(400)
        .json({ message: "HS code data not found. Please check again." })
    }
    const newData = await newHscode(payload)
    if (newData.data) {
      hscodeData.hscodeDetails = newData.data.Products[0].Classification
      hscodeData.description = newData.data.Products[0].Description
      hscodeData.image = newData.data.Products[0].Image
      hscodeData.title = newData.data.Products[0].Title
      await hscodeData.save()
      await sendNotification({
        user: req.userDetails,
        message: "Your hs code update successfully",
        emailMessage: `<p>Your hs code update successfully.</p>`,
        emailSubject: "Your hs code updated",
      })
      return res
        .status(200)
        .json({
          message: "HS Code data updated succesfully.",
          data: hscodeData,
        })
    } else {
      return res.status(500).json({ message: "Failed to update HS Code" })
    }
  } catch (error) {
    const err = error || 'Error updating HS Code'
    logger.error({ message: 'Failed to update HS code', error: err })
    res.status(error.status || 500).json({ message: err })
  }
}

module.exports = {
  generateNewHscode,
  fetchUserHscode,
  deleteHscodeData,
  editHscodeData,
}
