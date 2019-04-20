import firebase from "firebase";

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "scrapeclub.firebaseapp.com",
  projectId: "scrapeclub"
});

const db = firebase.firestore();

export default db;
