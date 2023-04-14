"use client";
import { RootState } from "../../store";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { JobProps } from "lib/types";

interface JobState {
  jobs: JobProps[] | null;
  page: number;
  position: string;
  company: string;
  jobLocation: string;
  jobTypeOptions: string[];
  jobType: string;
  statusOptions: string[];
  status: string;
  search: string;
  searchStatus: string;
  searchType: string;
  sort: string;
  sortOptions: string[];
  message: string;
  error: { name: string; message: string } | null;
}

export const initialState: JobState = {
  jobs: null,
  position: "",
  page: 1,
  company: "",
  jobLocation: "London, UK",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["Interviewing", "Declined", "Pending", "Offer"],
  status: "Pending",
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
  message: "",
  error: null,
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, { payload }: PayloadAction<JobProps[]>) => {
      state.jobs = payload;
    },
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setJobs, setPage, setError } = jobSlice.actions;

export const jobSelector = (state: RootState) => state.jobs;

export default jobSlice.reducer;
