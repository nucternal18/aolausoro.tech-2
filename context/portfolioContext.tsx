import { useEffect, useContext, createContext, useReducer } from "react";
import {
  collection,
  Timestamp,
  serverTimestamp,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  getDoc,
} from "@firebase/firestore";
import nookies, { parseCookies } from "nookies";
import { NEXT_URL } from "../config";

type ProjectType = {
  id?: string;
  url: string;
  projectName: string;
  github: string;
  address: string;
  techStack: string[];
  createdAt: typeof serverTimestamp;
};

interface InitialPortfolioState {
  loading: boolean;
  error: Error;
  projects: ProjectType[];
  message: string;
  imageUrl: string;
  project: ProjectType;
}

export enum ActionType {
  PROJECT_ACTION_REQUEST = "PROJECT_ACTION_REQUEST",
  PROJECT_ACTION_FAIL = "PROJECT_ACTION_FAIL",
  PROJECT_ADD_SUCCESS = "PROJECT_ADD_SUCCESS",
  PROJECT_UPDATE_SUCCESS = "PROJECT_UPDATE_SUCCESS",
  PROJECT_DELETE_SUCCESS = "PROJECT_DELETE_SUCCESS",
  PROJECT_IMAGE_UPLOAD_SUCCESS = "PROJECT_IMAGE_UPLOAD_SUCCESS",
  FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS",
  FETCH_PROJECT_SUCCESS = "FETCH_PROJECT_SUCCESS",
}

const initialState = {
  loading: false,
  error: null,
  projects: null,
  imageUrl: null,
  project: null,
  message: "",
};

export const portfolioContext = createContext<{
  state: InitialPortfolioState;
  dispatch: React.Dispatch<any>;
  addProject: ({
    projectName,
    github,
    address,
    techStack,
  }: {
    projectName: string;
    github: string;
    address: string;
    techStack: string[];
  }) => void;
  updateProject: ({
    projectName,
    github,
    address,
    techStack,
    id,
  }: {
    projectName: string;
    github: string;
    address: string;
    techStack: string[];
    id: string;
  }) => void;
  deleteProject: (id: string) => void;
  uploadImage: (base64EncodedImage: string | ArrayBuffer) => void;
}>({
  state: initialState,
  dispatch: () => null,
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  uploadImage: () => {},
});

const portfolioReducer = (state: InitialPortfolioState, action) => {
  switch (action.type) {
    case ActionType.PROJECT_ACTION_REQUEST:
      return { ...state, loading: true };
    case ActionType.PROJECT_ACTION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ActionType.PROJECT_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.PROJECT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.PROJECT_IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        imageUrl: action.payload.url,
        message: action.payload.message,
      };
    case ActionType.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: action.payload,
      };
    case ActionType.FETCH_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        project: action.payload,
      };
    default:
      return state;
  }
};

export const PortfolioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  const addProject = async ({
    projectName,
    github,
    address,
    techStack,
  }: {
    projectName: string;
    github: string;
    address: string;
    techStack: string[];
  }) => {
    try {
      dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
      const project = {
        url: state.imageUrl,
        projectName,
        github,
        address,
        techStack,
      };

      const res = await fetch(`${NEXT_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      dispatch({
        type: ActionType.PROJECT_ADD_SUCCESS,
        payload: "Project added successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.PROJECT_ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  const updateProject = async ({
    projectName,
    github,
    address,
    techStack,
    id,
  }: {
    projectName: string;
    github: string;
    address: string;
    techStack: string[];
    id: string;
  }) => {
    try {
      dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
      const project = {
        url: state.imageUrl,
        projectName,
        github,
        address,
        techStack,
      };

      const res = await fetch(`${NEXT_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      dispatch({
        type: ActionType.PROJECT_UPDATE_SUCCESS,
        payload: "Project updated successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.PROJECT_ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });

      const res = await fetch(`${NEXT_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch({
        type: ActionType.PROJECT_DELETE_SUCCESS,
        payload: "Project deleted successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.PROJECT_ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  const uploadImage = async (base64EncodedImage: string | ArrayBuffer) => {
    const cookie = parseCookies();
    try {
      dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
      const response = await fetch(`${NEXT_URL}/api/photos/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookie.token}`,
        },
        body: JSON.stringify({ data: base64EncodedImage }),
      });
      const data = await response.json();
      dispatch({
        type: ActionType.PROJECT_IMAGE_UPLOAD_SUCCESS,
        payload: { url: data.url, message: "Image uploaded successfully" },
      });
    } catch (error) {
      dispatch({
        type: ActionType.PROJECT_ACTION_FAIL,
        payload: error.message,
      });
    }
  };
  return (
    <portfolioContext.Provider
      value={{
        state,
        dispatch,
        addProject,
        updateProject,
        deleteProject,
        uploadImage,
      }}
    >
      {children}
    </portfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(portfolioContext);
};
