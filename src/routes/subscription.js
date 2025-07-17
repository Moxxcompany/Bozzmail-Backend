const express = require("express")
const router = express.Router()
const {
  getCurrentSubscription,
  getSubscriptionPlans,
  upgradeSubscription,
  cancelSubscription,
  getBillingCycle,
  getRenewalDate
} = require("../controllers/user/subscriptionController")

// Get current user's subscription
router.get("/current", getCurrentSubscription)

// Get all available subscription plans
router.get("/plans", getSubscriptionPlans)

// Upgrade subscription plan
router.post("/upgrade", upgradeSubscription)

// Cancel subscription
router.post("/cancel", cancelSubscription)

// Get subscription billing cycle
router.get("/billing-cycle", getBillingCycle)

// Get next renewal date
router.get("/renewal-date", getRenewalDate)

module.exports = router 