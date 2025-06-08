import admin, { ServiceAccount } from "firebase-admin";
// import { initializeApp, getApps, cert } from "firebase-admin/app";

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const databaseURL = undefined;

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    });
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

const db = firebaseAdmin.firestore();

export { firebaseAdmin, serviceAccount, db };
