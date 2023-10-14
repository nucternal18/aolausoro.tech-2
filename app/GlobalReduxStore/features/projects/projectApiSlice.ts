"use client";
import type { PartialProjectProps } from "schema/Project";
import { projectApiSlice } from "../../api";
import { setError, setImage } from "./projectsSlice";

export const projectApi = projectApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<PartialProjectProps[], void>({
      query: () => "/projects/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProjectById: build.query<PartialProjectProps, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, arg) => [
        { type: "Project", id: result?.id },
      ],
    }),
    createProject: build.mutation<
      { success: boolean; message: string },
      PartialProjectProps
    >({
      query: (project) => ({
        url: "/projects/create-project",
        method: "POST",
        body: { ...project },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
    updateProject: build.mutation<
      { success: boolean; message: string },
      PartialProjectProps
    >({
      query: (project) => ({
        url: `/projects/${project.id}`,
        method: "PUT",
        body: { ...project },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
    deleteProject: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
    }),
    uploadImage: build.mutation<string, string | ArrayBuffer | null>({
      query: (base64EncodedImage) => ({
        url: `/photos/upload`,
        method: "POST",
        body: { data: base64EncodedImage },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
      ],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setImage(data));
        } catch (error: any) {
          if (error.response) {
            dispatch(setError(error.response.data.message));
          } else {
            dispatch(setError(error.message));
          }
          console.log(error);
        }
      },
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
  useUploadImageMutation,
} = projectApi;
