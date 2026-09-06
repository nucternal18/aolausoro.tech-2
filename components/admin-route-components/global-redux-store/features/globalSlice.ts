import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CvProps } from "@src/entities/models/cv";

type GlobalState = {
  loading: boolean;
  error: Error;
  openModal: boolean;
  drawerOpened: boolean;
  mobileDrawerOpened: boolean;
  isEdit: boolean;
  cv: Pick<CvProps, "id" | "cvUrl">[];
};

const initialState: GlobalState = {
  loading: false,
  openModal: false,
  error: { name: "", message: "An Error occurred" },
  drawerOpened: false,
  mobileDrawerOpened: false,
  isEdit: false,
  cv: [],
};

export const fetchCV = createAsyncThunk(
  "global/fetchCV",
  async (): Promise<Pick<CvProps, "id" | "cvUrl">[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cv`);
    const data = await res.json();
    return data.data;
  },
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchCV.fulfilled, (state, { payload }) => {
      console.log(
        "🚀 ~ file: globalSlice.ts ~ line 85 ~ builder.addCase ~ payload",
        payload,
      );
      state.cv = payload;
    });
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
