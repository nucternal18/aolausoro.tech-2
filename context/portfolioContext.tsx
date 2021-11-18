import {  useEffect, useContext, createContext, useReducer } from 'react';
import { collection, Timestamp, serverTimestamp, addDoc, doc, updateDoc, onSnapshot } from '@firebase/firestore';
import { NEXT_URL } from '../config';
import { db } from './authContext';

type ProjectType = {
  id?: string;
    url: string;
      projectName: string;
      github:string;
      address: string;
      techStack: string[];
      createdAt: typeof serverTimestamp;
}

interface InitialPortfolioState {
    loading: boolean;
    error: Error;
    projects: ProjectType[];
    message: string;
    imageUrl: string;
  }
  
  export enum ActionType {
    PROJECT_ACTION_REQUEST = "PROJECT_ACTION_REQUEST",
    PROJECT_ACTION_FAIL = "PROJECT_ACTION_FAIL",
    PROJECT_ADD_SUCCESS = "PROJECT_ADD_SUCCESS",
    PROJECT_UPDATE_SUCCESS = "PROJECT_UPDATE_SUCCESS",
    PROJECT_DELETE_SUCCESS = "PROJECT_DELETE_SUCCESS",
    PROJECT_IMAGE_UPLOAD_SUCCESS='PROJECT_IMAGE_UPLOAD_SUCCESS',
    FETCH_PROJECT_SUCCESS = "FETCH_PROJECT_SUCCESS",
  }
  
  const initialState = {
    loading: false,
    error: null,
    projects: null,
    imageUrl: null,
    message: "",
  };
  
  
  export const portfolioContext = createContext<{
    state: InitialPortfolioState;
    dispatch: React.Dispatch<any>;
    addProject: (projectName: string, github: string, address: string) => void;
    updateProject: (projectName: string, github: string, address: string) => void;
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
      case ActionType.FETCH_PROJECT_SUCCESS:
        return {
          ...state,
          loading: false,
        projects: action.payload,
        };
      default:
        return state;
    }
  };

  export const PortfolioProvider = ({ children }) => {
    const [state, dispatch] = useReducer(portfolioReducer, initialState);

    useEffect(() => {
      const unsub = onSnapshot(collection(db,'projects'), (snapshot) => {
        const project = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: ActionType.FETCH_PROJECT_SUCCESS, payload: project });
      }, (error) => {
        dispatch({ type: ActionType.PROJECT_ACTION_FAIL, payload: error.message });
      }) 
      return unsub;
    },[]);

    const addProject = async (projectName: string, github: string, address: string) => {
        try {
            dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
            const project = {
                url: state.imageUrl,
                projectName,
                github,
                address,
                createdAt: serverTimestamp(),
              };
            await addDoc( collection(db,'projects'), project)

              dispatch({ type: ActionType.PROJECT_ADD_SUCCESS, payload: 'Project added successfully' });
        } catch (error) {
          dispatch({ type: ActionType.PROJECT_ACTION_FAIL, payload: error.message });
        }
            
    }

    const updateProject = async (projectName: string, github: string, address: string) => {
        try {
            dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
            const project = {
                url: state.imageUrl,
                projectName: projectName ? projectName : state.projects.projectName,
                github: github ? github : state.projects.github,
                address: address ? address : state.projects.address,
                createdAt: serverTimestamp(),
              };
              const projectRef = doc(db,'projects');
            await updateDoc(projectRef, project)

              dispatch({ type: ActionType.PROJECT_ADD_SUCCESS, payload: 'Project added successfully' });
        } catch (error) {
          dispatch({ type: ActionType.PROJECT_ACTION_FAIL, payload: error.message });
        }
    }

    const deleteProject = async (id: string) => {}

    const uploadImage = async (base64EncodedImage: string | ArrayBuffer) => {
        try {
            dispatch({ type: ActionType.PROJECT_ACTION_REQUEST });
            const response = await fetch(`${NEXT_URL}/api/photos/upload`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: base64EncodedImage }),
            });
            const data = await response.json();
            dispatch({
                type: ActionType.PROJECT_IMAGE_UPLOAD_SUCCESS,
                payload: {url: data.url, message: 'Image uploaded successfully'},
            })
            
          } catch (error) {
            dispatch({
                type: ActionType.PROJECT_ACTION_FAIL,
                payload: error.message,
            });
          }
    }
    return (
      <portfolioContext.Provider value={{ state, dispatch, addProject, updateProject, deleteProject, uploadImage }}>
        {children}
      </portfolioContext.Provider>
    );
  }

    export const usePortfolio = () => {
        return useContext(portfolioContext);
    }