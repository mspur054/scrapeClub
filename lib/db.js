import admin from "firebase-admin";

console.log(
  (
    "-----BEGIN PRIVATE KEY-----\n" +
    +process.env.GOOGLE_PRIVATE_KEY +
    "\n-----END PRIVATE KEY-----\n"
  ).replace(/\\n/g, "\n")
);

var config = {
  type: process.env.GOOGLE_TYPE,
  project_id: "scrapeclub",
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key:
    "-----BEGIN PRIVATE KEY-----\n" +
    +process.env.GOOGLE_PRIVATE_KEY +
    "\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-yzpme@scrapeclub.iam.gserviceaccount.com",
  client_id: "108339480123922167146",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yzpme%40scrapeclub.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://scrapeclub.firebaseio.com"
});

const db = admin.firestore();

export default db;
