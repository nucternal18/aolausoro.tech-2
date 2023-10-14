"use client";
import { type RootState } from "../../store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { partialJobSchema, type PartialJobProps } from "schema/Job";
import * as zod from "zod";

const jobSliceSchema = zod.object({
  jobs: zod.array(partialJobSchema).nullable(),
  page: zod.number(),
  jobTypeOptions: zod.array(zod.string()),
  statusOptions: zod.array(zod.string()),
  search: zod.string(),
  searchStatus: zod.string(),
  searchType: zod.string(),
  sort: zod.string(),
  sortOptions: zod.array(zod.string()),
  message: zod.string(),
  error: zod.object({ name: zod.string(), message: zod.string() }).nullable(),
});

export type JobSliceProps = zod.infer<typeof jobSliceSchema>;

export const initialState: JobSliceProps = {
  jobs: null,
  page: 1,
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  statusOptions: ["Interviewing", "Declined", "Pending", "Offer"],
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
    setJobs: (state, { payload }: PayloadAction<PartialJobProps[]>) => {
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
