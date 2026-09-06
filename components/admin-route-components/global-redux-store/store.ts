"use client";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./features/users/usersSlice";
import jobsReducer from "./features/jobs/jobsSlice";
import projectReducer from "./features/projects/projectsSlice";
import messageReducer from "./features/messages/messagesSlice";
import globalReducer from "./features/globalSlice";

const reducers = {
  user: userReducer,
  jobs: jobsReducer,
  projects: projectReducer,
  messages: messageReducer,
  global: globalReducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      // Add additional middleware here
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

const makeStore = () => store;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
