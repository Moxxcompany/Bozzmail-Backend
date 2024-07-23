const express = require("express")
const router = express.Router()
const {
  generateNewAddress,
  fetchUserAddresses,
  fetchAddressById,
  deleteUserAddress,
  editUserAddressData,
  verifyAddress,
  importAddresses,
} = require("../controllers/user/addressController")
const { addressValidations } = require("../validation/user")
const { uploadfile } = require("../utils/uploadFile")

router.get("/user", fetchUserAddresses)
router.post("/user", addressValidations, generateNewAddress)
router.get("/:id", fetchAddressById)
router.post("/:id/update", editUserAddressData)
router.delete("/:id", deleteUserAddress)
router.post("/verify", verifyAddress)
router.post("/import", uploadfile.single("file"), importAddresses)

module.exports = router
