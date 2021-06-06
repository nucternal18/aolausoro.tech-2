import React, { useState, useEffect, useContext, FC } from 'react';

import nookies from 'nookies';
import { auth, projectFirestore } from './firebase/firebaseClient';
import firebase from 'firebase/app';

type AuthContextProps = {
  children: React.ReactNode;
  user: firebase.User | null;
  setUser: () => void;
  error: {
    title: string;
    message: string;
  };
  setError: () => void;
  createAccount: (email: string, password: string) => void;
  loginHandler: (email: string, password: string) => void;
  logoutHandler: () => void;
};

type ErrorProps = {
  title: string;
  message: string;
};

export const authContext = React.createContext<Partial<AuthContextProps>>({});

const { Provider } = authContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null as firebase.User | null);
  const [error, setError] = useState<ErrorProps>({ title: '', message: '' });

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', {});
        return;
      }
      const uid = user.uid;
      const currentUser = projectFirestore.collection('users').doc(uid);
      currentUser.get().then((doc) => {
        if (doc.exists) {
          setUser(doc.data())
        } else {
          setError({ title: 'An error occurred', message: 'User does not exist. Please try again' });
        }
      }).catch((error) => {
        const message = error.message;
        setError({ title: 'An error occurred', message: message });
      })
      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, {});
    });
  }, []);

  const createAccount = async (email: string, password: string) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  const loginHandler = async (email: string, password: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  const logoutHandler = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  return (
    <Provider
      value={{ user, error, createAccount, loginHandler, logoutHandler }}>
      {children}
    </Provider>
  );
};

export const useAuth = () => useContext(authContext);
