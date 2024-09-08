import type { PartialUserProps } from "@src/entities/models/User";
import type { RootState } from "../../store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: PartialUserProps | null;
  message: string;
  image: string | ArrayBuffer | null;
  uploadProgress: number;
  pdf: string | ArrayBuffer | null;
  error: { name: string; message: string } | null;
}

export const initialState: UserState = {
  currentUser: null,
  message: "",
  image: null,
  uploadProgress: 0,
  pdf: null,
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
    setPDF: (state, { payload }: PayloadAction<string>) => {
      state.pdf = payload;
    },
    setUploadProgress: (state, { payload }: PayloadAction<number>) => {
      state.uploadProgress = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const {
  setUserState,
  resetUserState,
  setImage,
  setPDF,
  setError,
  setUploadProgress,
} = userSlice.actions;

export const userSelector = (state: RootState) => state.user;
export const currentUserSelector = (state: RootState) =>
  state.user?.currentUser;

export default userSlice.reducer;
