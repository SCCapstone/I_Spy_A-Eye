import firebase from "firebase";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

/**
 * This file allows the use of Firebase accross the app. For security purposes,
 * firebaseConfig values are stored in an env file. firebaseAuth is called in
 * LoginScreen.js, SignUpScreen.js, App.js, and SettingsScreen.js.
 */

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}
// Allows firebase to be used across the app.
const firebaseAuth = firebase.auth();

// These are settings that might allow Firestore to run on an emulator.
// firebase.firestore().settings({
//   host: "localhost:8080",
//   ssl: false,
//   merge: true,
//   experimentalForceLongPolling: true,
//   experimentalAutoDetectLongPolling: true,
// });

export { firebaseAuth };
