import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp({
        credential: cert({
            privateKey: process.env.PRIVATE_KEY,
            clientEmail: process.env.CLIENT_EMAIL,
            projectId: process.env.PROJECT_ID,
        }),
        databaseURL: process.env.DATABASE_URL,
});

// if (getApps().length === 0) {
//     initialApp = initializeApp({
//         credential: cert({
//             privateKey: process.env.PRIVATE_KEY,
//             clientEmail: process.env.CLIENT_EMAIL,
//             projectId: process.env.PROJECT_ID,
//         }),
//         databaseURL: process.env.DATABASE_URL,
//     });
//     console.log('Initialized')
// } else {
//     initialApp = initializeApp({});
//     console.log('Initialized')
// }



const initialAuth = getAuth();
const defaultFirestore = getFirestore();

export { initialAuth, defaultFirestore, Timestamp };