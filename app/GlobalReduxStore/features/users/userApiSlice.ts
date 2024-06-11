"use client";

import { userApiSlice } from "@app/GlobalReduxStore/api";
import { setError, setImage, setPDF, setUploadProgress } from "./usersSlice";
import type { PartialUserProps } from "schema/User";

export const userApi = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<PartialUserProps, void>({
      query: () => `/auth/user`,
      providesTags: (result, error, arg) => [{ type: "User", id: result?.id }],
    }),
    getCV: builder.query<string, void>({
      query: () => `/auth/cv`,
      providesTags: (result, error, arg) => [{ type: "User", id: result }],
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
      { image: string },
      string | ArrayBuffer | null
    >({
      query: (base64EncodedImage) => ({
        url: `/upload/photos`,
        method: "POST",
        body: { data: base64EncodedImage },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setImage(data.image));
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
    uploadPDFCv: builder.mutation<{ pdf: string }, string | ArrayBuffer | null>(
      {
        query: (base64EncodedImage) => ({
          url: `/upload/pdf`,
          method: "POST",
          body: { data: base64EncodedImage },
        }),
        invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
        onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            dispatch(setPDF(data.pdf));
          } catch (error: any) {
            if (error.response) {
              dispatch(setError(error.response.data.message));
            } else {
              dispatch(setError(error.message));
            }
            console.log(error);
          }
        },
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadUserImageMutation,
  useUploadPDFCvMutation,
} = userApi;
