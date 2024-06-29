const express = require('express')
const router = express.Router()
const { upload } = require('../utils/uploadPic')
const {
  getUserById,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg
} = require('../controllers/user/userController')

const {
  changePasswordValidations
} = require('../validation/user')

router.get("/:userId", getUserById)
router.post("/:userId/update-profile-pic", upload.single('profileImg'), updateUserProfileImg)
router.post("/:userId/update", updateUserDetails)
router.post("/:userId/delete", deleteUser)
router.post("/change-password", changePasswordValidations, changeUserPassword)

module.exports = router;