const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const apointment = require("../models/Apointment");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
// const {
//   courseEnrollmentEmail,
// } = require("../mail/templates/courseEnrollmentEmail");
// const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
// const CourseProgress = require("../models/CourseProgress");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { doctorid } = req.body;
  // const userId = req.user.id;
  if (doctorid.length === 0) {
    return res.json({ success: false, message: "Please Provide doctor ID" });
  }
  const { price } = await Course.findOne({
    _id: doctorid,
  })
    .select("price")
    .exec();

  let total_amount = price;

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    console.log("REsponse", price);
    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { response, amount, userId, doctorId } = req.body;
  console.log("DOctor ID", doctorId);
  console.log("Response", response);
  let orgamout = amount / 100;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    response;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const Patient = await User.findById(userId);

      await mailSender(
        Patient.email,
        `Payment Received`,
        `Hello ${Patient.firstName} your Payment towards Appointment recived succesfully Amout of ₹${orgamout} and OrderId is ${razorpay_order_id}`
      );
    } catch (error) {
      console.log("error in sending mail", error);
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" });
    }
    await enrollAppointment(doctorId, userId, orgamout);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

// enroll the student in the courses
const enrollAppointment = async (doctorId, userId, orgamout) => {
  console.log("doctorId", doctorId);
  console.log("userId", userId);
  console.log("orgamout", orgamout);
  try {
    //creating appointment in doctor Schema
    const doctorDetails = await User.findById(doctorId);
    const currentEarn = doctorDetails.earn || 0;
    doctorDetails.earn = currentEarn + orgamout;
    doctorDetails.save();

    const patientDetails = await User.findById(userId);

    const appointmentDetails = new apointment({
      patient: patientDetails._id,
      doctor: doctorDetails._id,
    });
    // Save the appointment object
    await appointmentDetails.save();
    // Update doctor's appointments
    doctorDetails.appointments.push(appointmentDetails._id);
    await doctorDetails.save();

    // Update patient's appointments
    patientDetails.appointments.push(appointmentDetails._id);
    await patientDetails.save();

    console.log("doctorDetails", doctorDetails);
    console.log("patientDetails", patientDetails);
  } catch (error) {
    console.log(error);
  }
};
