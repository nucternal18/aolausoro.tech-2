import { useEffect, useContext, createContext, useReducer } from "react";
import { JobProps, ProjectProps, UserInfoProps } from "lib/types";
import { ActionType } from "./appActions";
import { upload } from "lib/upload";
import { NEXT_URL } from "config";
import { getSession } from "next-auth/react";
import { appReducer } from "./appReducer";
import { parseCookies } from "nookies";

export interface InitialAppState {
  isEditing: boolean;
  editJobId: string;
  job: JobProps;
  loading: boolean;
  error: Error;
  projects: ProjectProps[];
  message: string;
  imageUrl: string;
  project: ProjectProps;
  isAuthenticated: boolean;
  success: boolean;
  userData: UserInfoProps;
}

export const initialState = {
  isAuthenticated: false,
  loading: false,
  success: false,
  error: null,
  userData: null,
  message: "",
  isEditing: false,
  editJobId: "",
  job: {
    position: "",
    company: "",
    jobLocation: "London, UK",
    jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
    jobType: "full-time",
    statusOptions: ["Interviewing", "Declined", "Pending", "Offer"],
    status: "Pending",
  },
  projects: null,
  imageUrl: null,
  project: null,
};

export const appContext = createContext<{
  state: InitialAppState;
  dispatch: React.Dispatch<any>;
  createAccount: (name: string, email: string, password: string) => void;
  updateProfile: (user: UserInfoProps) => void;
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
  addJob: (job: JobProps) => void;
  updateJob: (job: JobProps, cookie: string) => void;
  deleteJob: (id: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createAccount: () => {},
  updateProfile: () => {},
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  uploadImage: () => {},
  addJob: () => {},
  updateJob: () => {},
  deleteJob: () => {},
});

const { Provider } = appContext;

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        dispatch({
          type: ActionType.FETCH_USER_SUCCESS,
          payload: session.user,
        });
      }
    });
  }, []);

  // Authentication/User
  const createAccount = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    try {
      dispatch({
        type: ActionType.ACTION_REQUEST,
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
        type: ActionType.ACTION_FAIL,
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
        type: ActionType.ACTION_REQUEST,
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
        type: ActionType.ACTION_FAIL,
        payload: err,
      });
    }
  };

  // Projects

  /**
   *
   * @param param0
   */
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
      dispatch({ type: ActionType.ACTION_REQUEST });
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
        type: ActionType.ACTION_FAIL,
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
      dispatch({ type: ActionType.ACTION_REQUEST });
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
        type: ActionType.ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      dispatch({ type: ActionType.ACTION_REQUEST });

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
        type: ActionType.ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  // Jobs

  /**
   *
   * @param job
   */
  const addJob = async (job: JobProps): Promise<void> => {
    dispatch({ type: ActionType.ACTION_REQUEST });
    try {
      const { position, company, jobLocation, jobType, status } = job;
      await fetch(`${NEXT_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position,
          company,
          jobLocation,
          jobType,
          status,
        }),
      });
      dispatch({
        type: ActionType.JOB_ADD_SUCCESS,
        payload: "Job added successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  /**
   *
   * @param id
   */
  const updateJob = async (job: JobProps, cookie: string): Promise<void> => {
    dispatch({ type: ActionType.ACTION_REQUEST });
    const session = getSession();
    try {
      console.log("Edit job");
      await fetch(`${NEXT_URL}/api/jobs/${job._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: cookie,
        },
        body: JSON.stringify(job),
      });
      dispatch({
        type: ActionType.JOB_UPDATE_SUCCESS,
        payload: "Job updated successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  /**
   *
   * @param id
   */
  const deleteJob = async (id: string): Promise<void> => {
    dispatch({ type: ActionType.ACTION_REQUEST });
    try {
      await fetch(`${NEXT_URL}/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: ActionType.JOB_DELETE_SUCCESS,
        payload: "Job deleted successfully",
      });
    } catch (error) {
      dispatch({
        type: ActionType.ACTION_FAIL,
        payload: error.message,
      });
    }
  };

  /**
   * @desc Upload a base64EncodedImage to cloudinary
   *
   * @param base64EncodedImage
   */
  const uploadImage = async (base64EncodedImage: string): Promise<void> => {
    const cookie = parseCookies();
    try {
      dispatch({
        type: ActionType.ACTION_REQUEST,
      });
      const data = await upload(base64EncodedImage, cookie);

      if (data) {
        dispatch({
          type: ActionType.IMAGE_UPLOAD_SUCCESS,
          payload: { url: data, message: "Image uploaded successfully" },
        });
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Unable to upload image. Please try again.";
      dispatch({
        type: ActionType.ACTION_FAIL,
        payload: err,
      });
    }
  };

  return (
    <Provider
      value={{
        state,
        dispatch,
        createAccount,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addJob,
        updateJob,
        deleteJob,
        uploadImage,
      }}
    >
      {children}
    </Provider>
  );
};

export const useGlobalApp = () => useContext(appContext);
