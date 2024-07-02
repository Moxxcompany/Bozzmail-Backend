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

router.get("/details", getUserById)
router.post("/update-profile-pic", upload.single('profileImg'), updateUserProfileImg)
router.post("/update", updateUserDetails)
router.post("/delete", deleteUser)
router.post("/change-password", changePasswordValidations, changeUserPassword)

module.exports = router;