const admin = require("firebase-admin");

const serviceAccount = require("./email-system-2a226-4cceba5a0b40.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_SERVICE,
});

async function uploadFile(file) {
  try {
    const bucket = admin.storage().bucket();
    const destination = file.originalname;
    await bucket.file(destination).save(file.buffer);
    console.log("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
// Download a file from Firebase Storage
async function downloadFile(destinationFilePath, fileRef) {
  try {
    console.log("destinationFilePath", destinationFilePath);
    // console.log("fileRef", fileRef);

    const file = storage.bucket().file(fileRef);
    const d = await file.download({
      // destination: destinationFilePath,
    });
    console.log("d::::::::", d);
    console.log("File downloaded successfully!");
    return d;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

// get url of a file from Firebase Storage
async function getUrl(filename) {
  const storage = admin.storage();
  const bucket = storage.bucket();

  try {
    const file = bucket.file(filename);
    // Get the download URL
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 100);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: expirationDate.getTime(), // Adjust the expiration date as needed
    });
    console.log("File URL: ", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

// delete a file from Firebase Storage
async function deleteFile(filename) {
  const storage = admin.storage();
  const bucket = storage.bucket();
  try {
    await storage.bucket().file(filename).delete();
    console.log("File deleted successfully.");
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

const storage = admin.storage();
module.exports = { uploadFile, downloadFile, getUrl, deleteFile };
