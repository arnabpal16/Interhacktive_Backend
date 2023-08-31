const Razorpay = require("razorpay");

// Assuming your environment variables are properly set
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.instance = instance;
