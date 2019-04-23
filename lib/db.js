import admin from "firebase-admin";

require("dotenv").config();

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scrapeclub.firebaseio.com"
});

const db = admin.firestore();

export default db;
