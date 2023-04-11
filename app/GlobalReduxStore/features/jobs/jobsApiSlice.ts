import { jobsApiSlice } from "app/GlobalReduxStore/api";
import { JobsProps, StatsProps } from "lib/types";

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
    createJob: build.mutation<
      { success: boolean; message: string },
      JobsProps["jobs"]
    >({
      query: (job) => ({
        url: "/jobs/create-jobs",
        method: "POST",
        body: { ...job },
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
    updateJob: build.mutation({
      query: (job) => ({
        url: `/jobs/${job.id}`,
        method: "PUT",
        body: { ...job },
      }),
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),
    deleteJob: build.mutation({
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
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
