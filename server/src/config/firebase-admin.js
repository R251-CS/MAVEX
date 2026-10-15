const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID || 'mavex-cb807';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      projectId
    });
  } else {
    // If running in development without local Google credentials, provide explicit projectId
    admin.initializeApp({
      projectId
    });
  }
}

// In development, handle offline/uncredentialed Firestore queries gracefully
let db;
try {
  db = admin.firestore();
  // Ensure firestore doesn't throw uncaught init error when credentials missing in local dev
  db.settings({ ignoreUndefinedProperties: true });
} catch (e) {
  console.warn('Firestore initialization warning:', e.message);
}

const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
