const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { fetchUserById, updateUserPassword, fetchUserByPhoneNumber } = require("../../helper/user")
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../../utils/s3")
const { sendNotification } = require("../../helper/sendNotification")
const { logger } = require("../../utils/logger")

const getUserById = async (req, res) => {
  const id = req.userId
  try {
    const user = await fetchUserById(id)
    if (!user) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    res.status(200).json({ data: user })
  } catch (error) {
    const err = error || 'Error fetching user profile details'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const changeUserPassword = async (req, res) => {
  const id = req.userId
  const { currentPassword, newPassword } = req.body
  try {
    const user = await fetchUserById(id, true)
    if (!user || !user.is_active) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Your signin method is different." })
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password is incorrect" })
    }
    await updateUserPassword(user._id, newPassword)
    await sendNotification({
      user: user,
      message: "Your password for your account has been changed successfully.",
      emailMessage: `<p>Your password for your account has been changed successfully.</p>`,
      emailSubject: "Account Password reset successfuly",
    })
    res.status(200).json({ message: "Password Changed Successfully" })
  } catch (error) {
    const err = error || 'Error changing user password'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const updateUserDetails = async (req, res) => {
  const userId = req.userId
  const { fullName, phoneNumber, address } = req.body
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    if (phoneNumber && phoneNumber.length) {
      const checkUserWithPhoneNum = await fetchUserByPhoneNumber(phoneNumber)
      if (checkUserWithPhoneNum) {
        return res.status(400).json({ message: "Phone Number already in use" })
      }
    }
    user.fullName = fullName ? fullName : user.fullName
    user.phoneNumber = phoneNumber && phoneNumber.length ? phoneNumber : user.phoneNumber
    user.address = address ? address : user.address
    await user.save()
    await sendNotification({
      user: user,
      message: "Your details for your account has been updated successfully",
      emailMessage: `<p>Your details for your account has been updated successfully.</p>`,
      emailSubject: "Updated Account Details",
    })
    res.status(200).json({ message: "User details updated Successfully" })
  } catch (error) {
    const err = error || 'Error updating user profile data'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const deleteUser = async (req, res) => {
  const userId = req.userId
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    user.is_active = false
    await user.save()
    await sendNotification({
      user: user,
      message: "Your account has been deactivated successfully.",
      emailMessage: `<p>Your bozzmail account has been deactivated.</p>`,
      emailSubject: "Bozzmail account deactivation",
    })
    res.status(200).json({ message: "User data Deleted Successfully" })
  } catch (error) {
    const err = error || 'Error deleting user data'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const updateUserProfileImg = async (req, res) => {
  const userId = req.userId
  const file = req.file
  try {
    if (!file || !file.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "Please upload an image file" })
    }
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    if (user.profile_img) {
      const parsedUrl = new URL(user.profile_img)
      const pathname = parsedUrl.pathname
      const filename = pathname.split("/").pop()
      await deleteFile(`user-profile/${filename}`)
    }
    const imageName = crypto.randomBytes(32).toString("hex")
    await uploadFile(file.buffer, `user-profile/${imageName}`, file.mimetype)
    const url = await getObjectSignedUrl(`user-profile/${imageName}`)
    user.profile_img = url
    await user.save()
    await sendNotification({
      user: user,
      message:
        "Your profile picture for your account has been updated successfully.",
      emailMessage: `<p>Your profile picture for your account has been updated successfully.</p>`,
      emailSubject: "Updated Account Details",
    })
    res.status(200).json({ message: "Profile Pic updated", data: user })
  } catch (error) {
    const err = error || 'Error updating or adding user profile pic'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

const deleteUserProfileImg = async (req, res) => {
  const userId = req.userId
  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found. Check again" })
    }
    if (user.profile_img) {
      const parsedUrl = new URL(user.profile_img)
      const pathname = parsedUrl.pathname
      const filename = pathname.split("/").pop()
      await deleteFile(`user-profile/${filename}`)
    }
    user.profile_img = null
    await user.save()
    await sendNotification({
      user: user,
      message:
        "Your profile picture for your account has been deleted successfully",
      emailMessage: `<p>Your profile picture for your account has been deleted successfully.</p>`,
      emailSubject: "Deleted profile picture",
    })
    res.status(200).json({ message: "Profile Pic deleted" })
  } catch (error) {
    const err = error || 'Error deleting user profile pic'
    logger.error(err)
    res.status(error.status || 500).json({ message: err })
  }
}

module.exports = {
  getUserById,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg,
  deleteUserProfileImg,
}
