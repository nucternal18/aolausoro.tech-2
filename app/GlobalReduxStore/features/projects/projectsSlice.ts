"use client";
import { AppDispatch, RootState } from "../../store";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { ProjectProps } from "types/types";

interface ProjectState {
  projects: ProjectProps[] | null;
  image: string | ArrayBuffer | null;
  action: "Create" | "Update";
  editImage: boolean;
  error: { name: string; message: string } | null;
}

export const initialState: ProjectState = {
  projects: null,
  image: null,
  action: "Create",
  editImage: false,
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
    setAction: (state, { payload }: PayloadAction<"Create" | "Update">) => {
      state.action = payload;
    },
    setEditImage: (state, { payload }: PayloadAction<boolean>) => {
      state.editImage = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setProjects, setImage, setError, setAction, setEditImage } =
  projectSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const projectSelector = (state: RootState) => state.projects;

export default projectSlice.reducer;
