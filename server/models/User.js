// Import the Mongoose library
const mongoose = require("mongoose");
const WelcomeTemp = require("../mail/templates/welcomeEmail");
const mailSender = require("../utils/mailSender");
// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
  {
    // Define the name field with type String, required, and trimmed
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    // Define the email field with type String, required, and trimmed
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // Define the password field with type String and required
    password: {
      type: String,
      required: true,
    },
    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
    },
    HealthFile: {
      type: String,
    },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorPublish",
      },
    ],

    // Add timestamps for when the document is created and last modified
  },
  { timestamps: true }
);

async function sendWelcomeEmail(email, name) {
  try {
    const mailResponse = await mailSender(
      email,
      "Welcome onboard email",
      WelcomeTemp(name)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occured while sending mail", error);
    throw error;
  }
}

userSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  if (this.isNew) {
    await sendWelcomeEmail(this.email, this.firstName);
  }
  next();
});
// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("user", userSchema);
