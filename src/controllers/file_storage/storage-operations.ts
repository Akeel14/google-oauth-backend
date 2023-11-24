import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase";
import { app } from "../../config/firebase";

const { Media } = require("../../models");
const mongoose = require("mongoose");

async function addNewMediatoMongoDB(path, userId) {
  try {
    const newMedia = new Media({
      path: path,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(newMedia._id.toString());
    const saveMedia = await newMedia.save();
    return newMedia._id.toString();
  } catch (err) {
    console.log("ERR_DB_MEDIA: Failed to add a new media! ", err);
  }
}

async function updateMediaURL(url, mediaId) {
  try {
    const media = await Media.updateOne(
      { _id: mediaId },
      { $set: { url } }
    ).exec();
    console.log("UPDATED_URL");
  } catch (err) {
    console.error("ERROR_UPDATE_MEDIA: Failed to Update URL. ", err);
  }
}

async function uploadFileToFirebase(file, userId, mediaId) {
  const destinationPath = `${userId}/${mediaId}/${file.originalname}`;

  // Create a root reference
  // const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const metadata = {
    contentType: file.mimetype,
  };

  // Create a reference to file
  const storageRef = ref(storage, destinationPath);
  const contentArray = new Uint8Array(file.buffer);

  await uploadBytes(storageRef, contentArray, metadata).then((snapshot) => {
    console.log("SUCCESS_UPLOAD: Uploaded a blob or file!");
  });
}

/**
 * Get Download URL from Ref String.
 * @param ref
 * @param storage
 * @returns Download url
 */
async function getURLfromRef(storage, ref) {
  const pathRef = ref(storage, ref);
  try {
    const downloadURL = await getDownloadURL(pathRef);
    return downloadURL;
  } catch (err) {
    console.error("ERROR_DL: Failed to download media from Firebase FS.");
  }
}

/**
 * Download file from firebase fs
 * @param userId user _id in mogodb
 * @param mediaId  media id in mongo db
 * @param mediaPath path field in mongo db
 */
async function retrieveMedia(userId, mediaId, mediaPath) {
  // const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const pathRef = ref(storage, `${userId}/${mediaId}/${mediaPath}`);
  try {
    const downloadURL = await getDownloadURL(pathRef);
    return downloadURL;
  } catch (err) {
    console.error("ERROR_DL: Failed to download media from Firebase FS.");
  }
}

export {
  uploadFileToFirebase,
  addNewMediatoMongoDB,
  updateMediaURL,
  retrieveMedia,
};
