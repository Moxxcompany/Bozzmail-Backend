const express = require("express")
const router = express.Router()
const { upload } = require("../utils/uploadFile")
const {
  getUserById,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg,
  deleteUserProfileImg,
} = require("../controllers/user/userController")
const {
  addUserWalletDetails,
  addWalletFundsLink,
  getUserWalletBalance,
  getUserTransactions,
  getUserTransactionById
} = require("../controllers/user/paymentController")

const { changePasswordValidations, emailRequired } = require("../validation/user")
const {
  getUserNotification,
  changeNotificationReadStatus,
  deleteUserNotifications,
} = require("../controllers/user/notificationController")

// Dashboard endpoints
const {
  getDashboardStats,
  getRecentShipments,
  getUserProfileSummary,
} = require("../controllers/user/dashboardController")

router.get("/details", getUserById)
router.get("/notifications", getUserNotification)
router.post("/notifications/mark-read", changeNotificationReadStatus)
router.post("/delete-notifications", deleteUserNotifications)
router.post(
  "/update-profile-pic",
  upload.single("profileImg"),
  updateUserProfileImg
)
router.delete("/delete-profile-pic", deleteUserProfileImg)
router.post("/update", updateUserDetails)
router.post("/delete", deleteUser)
router.post("/change-password", changePasswordValidations, changeUserPassword)

router.post("/payment/register", emailRequired, addUserWalletDetails)
router.post("/payment/add-wallet-fund", addWalletFundsLink)
router.get("/payment/wallet-balance", getUserWalletBalance)
router.get("/payment/transactions", getUserTransactions)
router.get("/payment/transactions/:transactionId", getUserTransactionById)

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats)
router.get("/shipments/recent", getRecentShipments)
router.get("/profile/summary", getUserProfileSummary)

module.exports = router
