// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

import "dotenv/config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// console.log(firebaseConfig);
function initializeAdminApp() {
  // Send the cloud message through FCM
  const admin = require("firebase-admin");
  const { serviceAccount } = require("../config/firebase-accountkey"); // Download from Firebase Setting
  // Initialize Firebase Admin SDK
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...firebaseConfig,
  });
}

const adminApp = initializeAdminApp();

export { adminApp, firebaseConfig, app, storage };
