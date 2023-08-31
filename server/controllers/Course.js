const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
// Function to create a new course
exports.createDoctorPublishments = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;
    console.log(req.body.thumbnail);
    // Get all required fields from request body
    let {
      Docpublicname,
      DocDescription,
      Education,
      DocRegno,
      ClinicAddress,
      Language,
      price,
      category,
    } = req.body;
    // Get thumbnail image from request files

    // Check if any of the required fields are missing
    if (
      !Docpublicname ||
      !DocDescription ||
      !Education ||
      !DocRegno ||
      !ClinicAddress ||
      !Language ||
      !category ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    // Check if the user is an instructor
    const doctorDetails = await User.findById(userId, {
      accountType: "Doctor",
    });

    if (!doctorDetails) {
      return res.status(404).json({
        success: false,
        message: "Doctor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    // const thumbnailImage = await uploadImageToCloudinary(
    //   thumbnail,
    //   process.env.FOLDER_NAME
    // );
    // console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      Docpublicname,
      DocDescription,
      Doctor: doctorDetails._id,
      price,
      Education,
      DocRegno,
      Address: ClinicAddress,
      Language,
      category: categoryDetails._id,
      // thumbnail: thumbnailImage.secure_url,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: doctorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    console.log("HEREEEEEEEE", categoryDetails2);
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get Course List
exports.getAlldoctors = async (req, res) => {
  try {
    const allCourses = await Course.find({})
      .populate("Doctor")
      .populate("category")
      .exec();
    console.log(allCourses);
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

exports.getfulldocdetails = async (req, res) => {
  try {
    const { doctorid } = req.body;
    console.log(req.body);
    const courseDetails = await Course.findOne({
      _id: doctorid,
    })
      .populate({
        path: "Doctor",
        select: "-password -courses -PatientAppointed",
        populate: {
          path: "additionalDetails", // Assuming the field name is "additionalDetails"
        },
      })
      .populate("category")
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${doctorid}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
exports.getdoctorpublishments = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const doctorid = req.user.id;

    // Find all courses belonging to the instructor
    const doctorpublishments = await Course.find({
      Doctor: doctorid,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: doctorpublishments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to publishments",
      error: error.message,
    });
  }
};
// Delete the Course
exports.deletedoctor = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getUserAppointments = async (req, res) => {
  const { userId } = req.body; // Assuming you're sending the user ID in the request parameter
  console.log(userId);
  try {
    const user = await User.findById(userId);
    const userdetails = await User.findById(userId).populate({
      path: "appointments",
      populate: {
        path: "patient doctor",
        select: "firstName lastName",
      },
    });

    if (!userdetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const userAppointments = userdetails.appointments;

    if (userAppointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found for the user.",
      });
    }

    const formattedAppointments = userAppointments.map((appointment) => ({
      _id: appointment._id,
      patient: {
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      },
      doctor: {
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      },
    }));

    res
      .status(200)
      .json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user appointments." });
  }
};
