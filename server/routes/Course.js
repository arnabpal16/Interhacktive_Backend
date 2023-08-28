// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Importing Middlewares
const { auth, isDoctor, isPatient, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isDoctor, createCourse);
// Edit Course routes
router.post("/editCourse", auth, isDoctor, editCourse);
//Add a Section to a Course
router.post("/addSection", auth, isDoctor, createSection);
// Update a Section
router.post("/updateSection", auth, isDoctor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isDoctor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isDoctor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isDoctor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isDoctor, createSubSection);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isDoctor, getInstructorCourses);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// To get Course Progress
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

module.exports = router;
