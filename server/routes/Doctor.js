// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// doc Controllers Import
const {
  createDoctorPublishments,
  getAlldoctors,
  getfulldocdetails,
  getdoctorpublishments,
  deletedoctor,
  getUserAppointments,
} = require("../controllers/Course");

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Importing Middlewares
const { auth, isDoctor, isPatient, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isDoctor, createDoctorPublishments);

// Get all publishments Under a Specific doctor
router.get("/getInstructorCourses", auth, isDoctor, getdoctorpublishments);

router.get("/getAllCourses", getAlldoctors);
router.post("/getDocDetails", getfulldocdetails);

// Get Details for a Specific docto
// Delete a Course
router.delete("/deleteCourse", deletedoctor);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/getUserAppointments", auth, getUserAppointments);

module.exports = router;
