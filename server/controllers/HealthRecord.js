const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

exports.storeHealthRecord = async (req, res) => {
  try {
    console.log(req.body);
    let pdf = req.files.pdf;
    console.log(pdf);
    if (!pdf) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const result = await uploadImageToCloudinary(pdf, process.env.FOLDER_NAME);
    console.log(result);
    const fileUrl = result.secure_url;
    console.log(fileUrl);
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: fileUrl,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "File cannot store to db, please try again",
    });
  }
};
