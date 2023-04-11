import { AppDispatch, RootState } from "../../store";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { ProjectProps } from "lib/types";

interface ProjectState {
  projects: ProjectProps[] | null;
  image: string | ArrayBuffer | null;
  error: { name: string; message: string } | null;
}

export const initialState: ProjectState = {
  projects: null,
  image: null,
  error: null,
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, { payload }: PayloadAction<ProjectProps[]>) => {
      state.projects = payload;
    },
    setImage: (state, { payload }: PayloadAction<string>) => {
      state.image = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setProjects, setImage, setError } = projectSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const projectSelector = (state: RootState) => state.projects;

export default projectSlice.reducer;
