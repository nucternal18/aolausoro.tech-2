import { useState, useEffect, useContext, createContext, Context } from 'react';

import nookies from 'nookies';
import { auth, projectFirestore } from '../lib/firebaseClient';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';

interface AuthContextProps {
  user: firebase.User | null;
  loading: boolean;
  error: {
    title: string;
    message: string;
  };
  createAccount: (email: string, password: string) => void;
  loginHandler: (email: string, password: string) => void;
  logoutHandler: () => void;
};

type ErrorProps = {
  title: string;
  message: string;
};

export const authContext: Context<AuthContextProps> = createContext<AuthContextProps>({
  user: null,
  loading: false,
  error: {
    title: '',
    message: '',
  },
  createAccount: (_email: '', _password: '') => {},
  loginHandler: (_email: '', _password: '') => {},
  logoutHandler: () => {},
});

const { Provider } = authContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null as firebase.User | null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>({ title: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', {});
        return;
      }
      const uid = user.uid;
      const currentUser = projectFirestore.collection('users').doc(uid);
      currentUser
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUser(doc.data());
          } else {
            setError({
              title: 'An error occurred',
              message: 'User does not exist. Please try again',
            });
          }
        })
        .catch((error) => {
          const message = error.message;
          setError({ title: 'An error occurred', message: message });
        });
      const token = await user.getIdToken();
      nookies.set(undefined, 'token', token, {
        maxAge: 30 * 24 * 60 * 60,
        sameSite: true,
        path: '/'
      });
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const createAccount = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setLoading(false)
    } catch (error) {
      setLoading(false);
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  const loginHandler = async (email: string, password: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  const logoutHandler = async () => {
    try {
      await auth.signOut();
      nookies.destroy(undefined, 'token');
      router.push('/');
      setUser(null)
      setLoading(false);
      setError(null)
    } catch (error) {
      setLoading(false);
      const message = error.message;
      setError({ title: 'An error occurred', message: message });
    }
  };

  return (
    <Provider
      value={{ user, error, loading, createAccount, loginHandler, logoutHandler }}>
      {children}
    </Provider>
  );
};

export const useAuth = () => useContext(authContext);
