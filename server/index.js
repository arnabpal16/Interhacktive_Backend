// Importing necessary modules and packages
const express = require("express");
const app = express();
const multer = require("multer");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const doctorRoutes = require("./routes/Doctor");
const paymentRoutes = require("./routes/Payments");
const RazorPay = require("razorpay");
// const paymentRoutes = require("./routes/Payments");

const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const { storeHealthRecord } = require("./controllers/HealthRecord");
const { uploadImageToGCS } = require("./utils/fileUploader");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();

const instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Middlewares
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size (5 MB)
  },
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://med360-team-404.vercel.app",
      "https://med-n4ix5hnjea-el.a.run.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", doctorRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
// app.post("/api/v1/upload", storeHealthRecord);
app.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  const link = uploadImageToGCS(file);
});

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

// End of code.
