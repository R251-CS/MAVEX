const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You can pass service account credentials via environment variables or a json file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
