const express = require('express')
const router = express.Router()
const { upload } = require('../utils/uploadPic')
const {
  getUserById,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg,
  deleteUserProfileImg
} = require('../controllers/user/userController')

const {
  changePasswordValidations
} = require('../validation/user')
const {
  getUserNotification,
  changeNotificationReadStatus,
  deleteUserNotifications
} = require('../controllers/user/notificationController')

router.get("/details", getUserById)
router.get("/notifications", getUserNotification)
router.post("/notifications/mark-read", changeNotificationReadStatus)
router.post("/delete-notifications", deleteUserNotifications)
router.post("/update-profile-pic", upload.single('profileImg'), updateUserProfileImg)
router.delete("/delete-profile-pic", deleteUserProfileImg)
router.post("/update", updateUserDetails)
router.post("/delete", deleteUser)
router.post("/change-password", changePasswordValidations, changeUserPassword)

module.exports = router;