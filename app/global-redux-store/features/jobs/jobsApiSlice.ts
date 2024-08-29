import { jobsApiSlice } from "@app/global-redux-store/api";
import type { JobsProps, PartialJobProps, StatsProps } from "schema/Job";

export const jobsApi = jobsApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStats: build.query<StatsProps, void>({
      query: () => "/jobs/stats",
      providesTags: (result) => [{ type: "Jobs", id: "LIST" }],
    }),
    getJobs: build.query<
      JobsProps,
      {
        status?: string;
        jobType?: string;
        sort?: string;
        search?: string;
        page?: string;
        limit?: string;
      }
    >({
      query: ({ status, jobType, sort, search, page, limit }) => ({
        url: "/jobs/get-jobs",
        params: { status, jobType, sort, search, page, limit },
      }),
      providesTags: (result) =>
        result?.jobs?.map((job) => ({ type: "Jobs", id: job.id })) ?? [
          { type: "Jobs", id: "LIST" },
        ],
    }),
    getJobById: build.query<PartialJobProps, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result) => [{ type: "Jobs", id: result?.id }],
    }),
    createJob: build.mutation<
      { success: boolean; message: string },
      PartialJobProps
    >({
      query: (job) => ({
        url: "/jobs/create-jobs",
        method: "POST",
        body: { ...job },
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
    updateJob: build.mutation<
      { success: boolean; message: string },
      PartialJobProps
    >({
      query: (job) => ({
        url: `/jobs/${job.id}`,
        method: "PUT",
        body: { ...job },
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
    deleteJob: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
