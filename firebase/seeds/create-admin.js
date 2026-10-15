/**
 * Seed script to safely create the initial administrator account
 * Usage: node seeds/create-admin.js <email> <password> <name>
 */
require('dotenv').config({ path: '../server/.env' });
const admin = require('firebase-admin');

if (!admin.apps.length) {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@mavex.com';
  const password = args[1] || 'Admin@Mavex2026!';
  const name = args[2] || 'مدير النظام';

  try {
    console.log(`[Seed] Creating/verifying admin user: ${email}...`);

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`User already exists with UID: ${userRecord.uid}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          displayName: name
        });
        console.log(`Created new auth user with UID: ${userRecord.uid}`);
      } else {
        throw err;
      }
    }

    // Set custom claims and firestore profile
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: 'admin',
      departmentId: null,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Admin account configured successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdmin();
