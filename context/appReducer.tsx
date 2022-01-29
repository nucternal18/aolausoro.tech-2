import { ActionType } from "./appActions";
import { InitialAppState, initialState } from "./appContext";

export const appReducer = (state: InitialAppState, action) => {
  switch (action.type) {
    case ActionType.ACTION_REQUEST:
      return { ...state, loading: true };
    case ActionType.ACTION_FAIL:
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
    case ActionType.IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        imageUrl: action.payload,
        message: action.payload.message,
      };
    case ActionType.PROJECT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.JOB_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        isEditing: false,
        message: action.payload,
      };
    case ActionType.JOB_EDIT_STATUS:
      return {
        ...state,
        loading: false,
        isEditing: action.payload,
      };
    case ActionType.JOB_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        isEditing: false,
        message: action.payload,
      };
    case ActionType.JOB_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case ActionType.USER_LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
