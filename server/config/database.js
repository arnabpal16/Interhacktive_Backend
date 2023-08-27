const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL =
  "mongodb+srv://Niladri2003:pownan00@studynation.1vhs6jk.mongodb.net/studynationDB";

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
};
