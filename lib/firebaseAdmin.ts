import * as firebaseAdmin from 'firebase-admin';


if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            privateKey: process.env.PRIVATE_KEY,
            clientEmail: process.env.CLIENT_EMAIL,
            projectId: process.env.PROJECT_ID,
        }),
        databaseURL: process.env.DATABASE_URL,
    });
}

const db = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();

export { auth, db };