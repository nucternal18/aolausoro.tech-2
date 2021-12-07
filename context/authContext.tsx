import { useEffect, useContext, createContext, useReducer } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  onIdTokenChanged,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import nookies from "nookies";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "aolausoro-tech.firebaseapp.com",
  databaseURL: "https://aolausoro-tech.firebaseio.com",
  projectId: "aolausoro-tech",
  storageBucket: "aolausoro-tech.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_APP_ID,
  appId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
};

// Initialize Firebase
export const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

interface InitialAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: Error;
  userData: User;
  message: string;
}

export enum ActionType {
  USER_ACTION_REQUEST = "USER_ACTION_REQUEST",
  USER_ACTION_FAIL = "USER_ACTION_FAIL",
  USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS",
  USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS",
  USER_UPDATE_PROFILE_SUCCESS = "USER_UPDATE_PROFILE_SUCCESS",
  USER_EDIT_SUCCESS = "USER_EDIT_SUCCESS",
  USER_REQUEST_PASSWORD_RESET_SUCCESS = "USER_REQUEST_PASSWORD_RESET_SUCCESS",
  USER_RESET_PASSWORD_SUCCESS = "USER_RESET_PASSWORD_SUCCESS",
  USER_EMAIL_VERIFICATION_SUCCESS = "USER_EMAIL_VERIFICATION_SUCCESS",
  USER_IMAGE_UPLOAD_SUCCESS = "USER_IMAGE_UPLOAD_SUCCESS",
  USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS",
  FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS",
}

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  userData: null,
  message: "",
};

export const authContext = createContext<{
  state: InitialAuthState;
  dispatch: React.Dispatch<any>;
  createAccount: (email: string, password: string) => void;
  loginHandler: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void;
  logoutHandler: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  createAccount: () => {},
  loginHandler: () => {},
  logoutHandler: () => {},
});

const authReducer = (state: InitialAuthState, action) => {
  switch (action.type) {
    case ActionType.USER_ACTION_REQUEST:
      return { ...state, loading: true };
    case ActionType.USER_ACTION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ActionType.USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
      };
    case ActionType.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.payload,
        isAuthenticated: true,
      };
    case ActionType.USER_LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export const auth = getAuth();

const { Provider } = authContext;

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        dispatch({
          type: ActionType.USER_LOGOUT_SUCCESS,
        });
        nookies.set(undefined, "token", "", { path: "/" });
        return;
      }
      const userData = {
        uid: user.uid,
        displayName: user.displayName ? user.displayName : "",
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
      };

      dispatch({
        type: ActionType.FETCH_USER_SUCCESS,
        payload: userData,
      });
      const token = await user.getIdToken();
      nookies.set(undefined, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        sameSite: true,
        path: "/",
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
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch({
        type: ActionType.USER_REGISTER_SUCCESS,
        payload: "Account created successfully",
      });
    } catch (error) {
      const errorMessage = error.message;
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: errorMessage,
      });
    }
  };

  const loginHandler = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });
      await signInWithEmailAndPassword(auth, email, password);
      dispatch({});
    } catch (error) {
      const errorMessage = error.message;
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: errorMessage,
      });
    }
  };

  const logoutHandler = async () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: ActionType.USER_LOGOUT_SUCCESS,
        });
        nookies.destroy(undefined, "token");
      })
      .catch((error) => {
        const errorMessage = error.message;
        dispatch({
          type: ActionType.USER_ACTION_FAIL,
          payload: errorMessage,
        });
      });
  };

  return (
    <Provider
      value={{ state, dispatch, createAccount, loginHandler, logoutHandler }}
    >
      {children}
    </Provider>
  );
};

export const useAuth = () => useContext(authContext);
