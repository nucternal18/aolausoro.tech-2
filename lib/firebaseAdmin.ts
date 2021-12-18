import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    }),
    databaseURL: process.env.DATABASE_URL,
  });
}

const initialAuth = getAuth();
const defaultFirestore = getFirestore();

export { initialAuth, defaultFirestore, Timestamp };
