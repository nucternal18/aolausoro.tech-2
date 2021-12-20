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
import { NEXT_URL } from "config";
import { uploadImage } from "lib/upload";

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
export const database = getFirestore(app);

type UserInfoProps = {
  id: string;
  name: string;
  image?: string;
  token?: string;
  isAdmin?: boolean;
  email: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
interface InitialAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  success: boolean;
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
  success: false,
  error: null,
  userData: null,
  message: "",
};

export const authContext = createContext<{
  state: InitialAuthState;
  dispatch: React.Dispatch<any>;
  createAccount: (name: string, email: string, password: string) => void;
  updateProfile: (user: UserInfoProps) => void;
  uploadUserImage: (base64EncodedImage: string | ArrayBuffer) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createAccount: () => {},
  updateProfile: () => {},
  uploadUserImage: () => {},
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
        success: true,
        message: action.payload,
      };
    case ActionType.USER_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload,
      };
    case ActionType.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: action.payload,
        isAuthenticated: true,
      };
    case ActionType.USER_IMAGE_UPLOAD_SUCCESS:
      return { ...state, loading: false, success: true, image: action.payload };
    default:
      return state;
  }
};

const { Provider } = authContext;

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  const createAccount = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });
      const res = await fetch(`${NEXT_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          email,
          password,
          image:
            "https://firebasestorage.googleapis.com/v0/b/aolausoro-tech.appspot.com/o/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a.jpeg?alt=media&token=52d9c142-99bc-4772-98db-a28c352d9deb",
          isAdmin: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: ActionType.USER_REGISTER_SUCCESS,
          payload: "Account created successfully",
        });
      }
    } catch (error) {
      const errorMessage = error.message;
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: errorMessage,
      });
    }
  };

  /**
   * @desc Update current logged in user profile details
   *
   * @param user
   * @returns {Promise<void>}
   */
  const updateProfile = async (user: UserInfoProps): Promise<void> => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });

      const res = await fetch(`${NEXT_URL}/api/auth/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: ActionType.USER_UPDATE_PROFILE_SUCCESS,
          payload: data,
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to update user details. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  /**
   * @desc Upload a base64EncodedImage to cloudinary
   *
   * @param base64EncodedImage
   */
  const uploadUserImage = async (base64EncodedImage: string): Promise<void> => {
    try {
      dispatch({
        type: ActionType.USER_ACTION_REQUEST,
      });
      const data = await uploadImage(base64EncodedImage);

      if (data) {
        dispatch({ type: ActionType.USER_IMAGE_UPLOAD_SUCCESS, payload: data });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to upload image. Please try again.";
      dispatch({
        type: ActionType.USER_ACTION_FAIL,
        payload: err,
      });
    }
  };

  return (
    <Provider
      value={{ state, dispatch, createAccount, uploadUserImage, updateProfile }}
    >
      {children}
    </Provider>
  );
};

export const useAuth = () => useContext(authContext);
