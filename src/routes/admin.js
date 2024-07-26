const express = require("express")
const router = express.Router()
const {
  getUserList,
  getUserById,
  updateUserDetails,
  deleteUserById,
  fetchAllShipments
} = require("../controllers/admin/adminController")

router.get("/users", getUserList)
router.get("/users/:id", getUserById)
router.post("/users/update/:id", updateUserDetails)
router.post("/users/delete/:id", deleteUserById)
router.get("/shipments", fetchAllShipments)

module.exports = router
