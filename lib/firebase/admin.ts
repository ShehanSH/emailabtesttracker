import admin from "firebase-admin";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasAdminCredentials =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(privateKey);

if (!admin.apps.length && hasAdminCredentials) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

function assertAdminInitialized() {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase admin is not initialized. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your environment."
    );
  }
}

export function adminDb() {
  assertAdminInitialized();
  return admin.firestore();
}

export function adminAuth() {
  assertAdminInitialized();
  return admin.auth();
}

export function adminStorage() {
  assertAdminInitialized();
  return admin.storage().bucket();
}

