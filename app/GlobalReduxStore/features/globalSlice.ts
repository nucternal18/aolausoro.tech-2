import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "../store";

type GlobalState = {
  loading: boolean;
  error: Error;
  openModal: boolean;
  drawerOpened: boolean;
  mobileDrawerOpened: boolean;
  isEdit: boolean;
};

const initialState: GlobalState = {
  loading: false,
  openModal: false,
  error: { name: "", message: "An Error occurred" },
  drawerOpened: false,
  mobileDrawerOpened: false,
  isEdit: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
    setDrawerOpened: (state, { payload }: PayloadAction<boolean>) => {
      state.drawerOpened = payload;
    },
    setMobileDrawerOpened: (state, { payload }: PayloadAction<boolean>) => {
      state.mobileDrawerOpened = payload;
    },
    setIsEdit: (state, { payload }: PayloadAction<boolean>) => {
      state.isEdit = payload;
    },
    setOpenModal: (state, { payload }: PayloadAction<boolean>) => {
      state.openModal = payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setDrawerOpened,
  setMobileDrawerOpened,
  setOpenModal,
  setIsEdit,
} = globalSlice.actions;
export const globalSelector = (state: RootState) => state.global;

export default globalSlice.reducer;
