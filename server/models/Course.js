const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
  Docpublicname: { type: String },
  DocDescription: { type: String },
  Doctor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  Education: {
    type: String,
  },

  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  PatientAppointed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  DocRegno: {
    type: String,
  },
  Language: {
    type: String,
  },
  Address: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);
// module.exports = mongoose.model("DoctorPublish", doctorPublishSchema);
