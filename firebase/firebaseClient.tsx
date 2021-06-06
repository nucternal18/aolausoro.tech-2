import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'aolausoro-tech.firebaseapp.com',
  databaseURL: 'https://aolausoro-tech.firebaseio.com',
  projectId: 'aolausoro-tech',
  storageBucket: 'aolausoro-tech.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_APP_ID,
  appId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
};

// Initialize Firebase
function firebaseClient() {
    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
}

firebaseClient()

const auth = firebase.auth();
const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = projectFirestore.doc(`users/${userAuth.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user ', error.message);
    }
  }
  return userRef;
};

export {
  auth,
  projectStorage,
  projectFirestore,
  timestamp,
  createUserProfileDocument,
  firebaseClient
};