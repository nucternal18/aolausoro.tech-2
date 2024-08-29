import axios, { AxiosError } from "axios";
import { userApiSlice } from "@app/global-redux-store/api";
import { setError, setImage, setPDF, setUploadProgress } from "./usersSlice";
import type { PartialUserProps } from "schema/User";
import type { UploadApiResponse } from "cloudinary";
import type { PartialCvProps } from "schema/cv";

export const userApi = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<PartialUserProps, void>({
      query: () => `/auth/user`,
      providesTags: (result, error, arg) => [{ type: "User", id: result?.id }],
    }),
    getCV: builder.query<PartialCvProps[], void>({
      query: () => `/cv`,
      providesTags: (result) =>
        result
          ? [
              ...(result?.map(
                (cv) =>
                  ({
                    type: "User",
                    id: cv?.id,
                  }) as const,
              ) ?? []),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    createCV: builder.mutation<{ success: boolean; message: string }, string>({
      query: (cvUrl) => ({
        url: `/cv/create`,
        method: "POST",
        body: { cvUrl },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      { success: boolean; message: string },
      PartialUserProps
    >({
      query: (user) => ({
        url: "/auth/user/update-profile",
        method: "PUT",
        body: { ...user },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
    }),
    uploadUserImage: builder.mutation<
      UploadApiResponse,
      { url: string; data: FormData }
    >({
      queryFn: async ({ url, data }, api, extraOptions, baseQuery) => {
        try {
          const result = await axios.post(url, data, {
            //...other options like headers here
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (upload) => {
              //Set the progress value to show the progress bar
              const uploadloadProgress = Math.round(
                (100 * upload.loaded) / (upload.total as number),
              );
              api.dispatch(setUploadProgress(uploadloadProgress));
            },
          });

          return { data: result.data };
        } catch (axiosError: any) {
          if (axiosError instanceof AxiosError) {
            const err = axiosError;
            return {
              error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
              },
            };
          }
          return {
            error: {
              status: 500,
              data: "Something went wrong uploading image",
            },
          };
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setImage(data.secure_url));
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
    uploadPDFCv: builder.mutation<
      UploadApiResponse,
      { url: string; data: FormData }
    >({
      queryFn: async ({ url, data }, api, extraOptions, baseQuery) => {
        try {
          const result = await axios.post(url, data, {
            //...other options like headers here
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (upload) => {
              //Set the progress value to show the progress bar
              const uploadloadProgress = Math.round(
                (100 * upload.loaded) / (upload.total as number),
              );
              api.dispatch(setUploadProgress(uploadloadProgress));
            },
          });

          return { data: result.data };
        } catch (axiosError: any) {
          if (axiosError instanceof AxiosError) {
            const err = axiosError;
            return {
              error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
              },
            };
          }
          return {
            error: {
              status: 500,
              data: "Something went wrong uploading image",
            },
          };
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPDF(data.secure_url));
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
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadUserImageMutation,
  useUploadPDFCvMutation,
  useGetCVQuery,
  useCreateCVMutation,
} = userApi;
