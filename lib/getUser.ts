import {  getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

export default async function getUser(token): Promise<{ user: any;  }> {
    
    let userData;
    const userToken = await getAuth().verifyIdToken(token);

    const userRef = getFirestore().collection('users').doc(userToken.uid);
    const snapshot = await userRef.get();
    snapshot.exists ? (userData = snapshot.data()) : (userData = null);
    
    return {
        user: userData,
    };
}
