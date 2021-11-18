import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import nookies from 'nookies';
import { defaultFirestore } from './firebaseAdmin';

export default async function getUser(token): Promise<{ user: any;  }> {
    
    let userData;
    const userToken = await getAuth().verifyIdToken(token);

    const userRef = defaultFirestore.collection('users').doc(userToken.uid);
    const snapshot = await userRef.get();
    snapshot.exists ? (userData = snapshot.data()) : (userData = null);
    
    return {
        user: userData,
    };
}
