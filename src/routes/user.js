const express = require('express')
const router = express.Router()
const { uploads } = require('../utils/uploadPic')
const {
  fetchUserDetails,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg
} = require('../controllers/userController')

const {
  changePasswordSchema
} = require('../validation/user')

router.get("/:userId", fetchUserDetails)
router.post("/:userId/update-profile-pic", uploads.single('profileImg'), updateUserProfileImg )
router.post("/:userId/update", updateUserDetails)
router.post("/:userId/delete", deleteUser)
router.post("/change-password", changePasswordSchema, changeUserPassword)

module.exports = router;