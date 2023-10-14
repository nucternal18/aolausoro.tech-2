"use client";
import type { PartialUserProps } from "schema/User";
import type { RootState } from "../../store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: PartialUserProps | null;
  message: string;
  image: string | ArrayBuffer | null;
  error: { name: string; message: string } | null;
}

export const initialState: UserState = {
  currentUser: null,
  message: "",
  image: null,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (
      state,
      {
        payload: { currentUser },
      }: PayloadAction<{ currentUser: PartialUserProps }>,
    ) => {
      state.currentUser = currentUser;
    },
    resetUserState: (state) => {
      state.currentUser = null;
      state.message = "";
      state.error = { name: "", message: "" };
    },
    setImage: (state, { payload }: PayloadAction<string>) => {
      state.image = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setUserState, resetUserState, setImage, setError } =
  userSlice.actions;

export const userSelector = (state: RootState) => state.user;
export const currentUserSelector = (state: RootState) =>
  state.user?.currentUser;

export default userSlice.reducer;
