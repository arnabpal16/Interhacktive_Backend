// google cloud storage
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { rejects } = require("assert");
const { v4: uuidv4 } = require("uuid");

const servicekey = path.join(
  __dirname,
  "../hospital-backend-396618-17bf51c76aac.json"
);

const gc = new Storage({
  keyFilename: servicekey,
  projectId: "hospital-backend-396618",
});

const fileBucket = gc.bucket("hospital-storage");
//gc.getBuckets().then((x) => console.log(x));

async function uploadImageToGCS(uploadedFile, res) {
  try {
    const fileExtension = uploadedFile.name.split(".").pop();
    const randomFileName = `${uuidv4()}.${fileExtension}`; // Generate a random name with the same extension

    const file = fileBucket.file(randomFileName);
    const blobStream = file.createWriteStream();

    blobStream.on("error", (err) => {
      console.error(err);
    });

    blobStream.on("finish", () => {});

    blobStream.end(uploadedFile.buffer); // Use uploadedFile.data to get the binary data

    return `https://storage.googleapis.com/hospital-storage/${randomFileName}`;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { uploadImageToGCS };
