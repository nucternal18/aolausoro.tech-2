"use client";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  userApiSlice,
  messageApiSlice,
  projectApiSlice,
  jobsApiSlice,
} from "./api";
import userReducer from "./features/users/usersSlice";
import jobsReducer from "./features/jobs/jobsSlice";
import projectReducer from "./features/projects/projectsSlice";
import messageReducer from "./features/messages/messagesSlice";

const reducers = {
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [messageApiSlice.reducerPath]: messageApiSlice.reducer,
  [projectApiSlice.reducerPath]: projectApiSlice.reducer,
  [jobsApiSlice.reducerPath]: jobsApiSlice.reducer,
  user: userReducer,
  jobs: jobsReducer,
  projects: projectReducer,
  messages: messageReducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userApiSlice.middleware,
      messageApiSlice.middleware,
      projectApiSlice.middleware,
      jobsApiSlice.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

const makeStore = () => store;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
