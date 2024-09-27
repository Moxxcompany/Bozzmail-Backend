const express = require("express")
const router = express.Router()
const {
  postGridWebhook,
} = require("../controllers/printMail/printMailController")
const { purchaseShipment } = require("../controllers/shipments/shipmentController")

router.post(
  "/print-mail",
  express.raw({ type: "application/json" }),
  postGridWebhook
)

router.get(
  "/dynopay-purchase",
  purchaseShipment
)

module.exports = router
