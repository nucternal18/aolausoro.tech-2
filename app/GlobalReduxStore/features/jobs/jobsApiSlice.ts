import { jobsApiSlice } from "app/GlobalReduxStore/api";
import { StatsProps } from "lib/types";

export const jobsApi = jobsApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStats: build.query<StatsProps, void>({
      query: () => "/jobs/stats",
      providesTags: (result) => [{ type: "Jobs", id: "LIST" }],
    }),
    getJobs: build.query({
      query: ({ status, jobType, sort, search, page, limit }) => ({
        url: "/jobs/get-jobs",
        params: { status, jobType, sort, search, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Job", id })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
    }),
  }),
});

export const { useGetStatsQuery, useGetJobsQuery } = jobsApi;
