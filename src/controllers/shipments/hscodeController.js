const {
  createNewHscode,
  findUserHscode,
  deleteHscodeDetail,
  findHscodeDetailsById,
} = require("../../helper/hscode")
const { sendNotification } = require("../../helper/sendNotification")
const { newHscode } = require("../../services/flavourclousServices")

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
          message: "Your hashcode genreated successfully",
          emailMessage: `<p>Your hashcode genreated successfully.</p>`,
          emailSubject: "Your hashcode",
        })
        return res.status(200).json({ data: hscode })
      }
    } else {
      return res.status(500).json({ message: "Failed to create HS Code" })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.response?.data?.error || error?.response?.data })
  }
}

const fetchUserHscode = async (req, res) => {
  const userId = req.userId
  const { page, limit } = req.query
  try {
    const hscodeData = await findUserHscode(userId, page, limit)
    res.status(200).json({ hscodeData })
  } catch (error) {
    res.status(error.status || 500).json({ message: error })
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
      emailSubject: "Hashcode",
    })
    res.status(200).json({ message: "HS Code data deleted succesfully." })
  } catch (error) {
    res.status(error.status || 500).json({ message: error })
  }
}

const editHscodeData = async (req, res) => {
  const userId = req.userId
  const hscodeId = req.params.customId
  const payload = req.body
  try {
    const hscodeData = await findHscodeDetailsById(userId, hscodeId)
    if (!hscodeData) {
      return res
        .status(400)
        .json({ message: "HS code data not found. Please check again." })
    }
    const newData = await createNewHscode(payload)
    if (newData.data) {
      hscodeData.hscodeDetails = response.data.Products[0].Classification
      hscodeData.description = response.data.Products[0].Description
      hscodeData.image = response.data.Products[0].Image
      hscodeData.title = response.data.Products[0].Title
      await hscodeData.save()
      await sendNotification({
        user: req.userDetails,
        message: "Your hashcode update successfully",
        emailMessage: `<p>Your hashcode update successfully.</p>`,
        emailSubject: "Your hashcode updated",
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
    res.status(error.status || 500).json({ message: error })
  }
}

module.exports = {
  generateNewHscode,
  fetchUserHscode,
  deleteHscodeData,
  editHscodeData,
}
