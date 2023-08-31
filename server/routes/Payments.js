// Import the required modules
const express = require("express");
const router = express.Router();
const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payments");
const { auth, isDoctor, isPatient, isAdmin } = require("../middleware/auth");

router.post("/capturePayment", auth, isPatient, capturePayment);
router.post("/verifyPayment", verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isPatient,
  sendPaymentSuccessEmail
);
// router.post("/verifySignature", verifySignature);

module.exports = router;
