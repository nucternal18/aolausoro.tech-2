import admin from 'firebase-admin'
import serviceAccount from '../aolausoro-tech-firebase-adminsdk-d44mh-4bd1025f28.json';


export const verifyIdToken = (token) => {
    if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          databaseURL: 'https://aolausoro-tech.firebaseio.com',
        });
    }

    return admin.auth().verifyIdToken(token).catch(error => {
        throw error;
    })
}