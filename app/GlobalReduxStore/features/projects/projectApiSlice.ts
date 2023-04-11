"use client";
import { projectApiSlice } from "app/GlobalReduxStore/api";
import { ProjectProps } from "./../../../../lib/types";

export const projectApi = projectApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectProps[], void>({
      query: () => "/projects/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProjectById: build.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, arg) => [
        { type: "Project", id: result?.id },
      ],
    }),
    createProject: build.mutation({
      query: (project) => ({
        url: "/projects/create-project",
        method: "POST",
        body: { ...project },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
    updateProject: build.mutation({
      query: (project) => ({
        url: `/projects/${project.id}`,
        method: "PUT",
        body: { ...project },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
    deleteProject: build.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
