"use client";

import { userApiSlice } from "@app/GlobalReduxStore/api";
import { setError, setImage } from "./usersSlice";
import type { PartialUserProps } from "schema/User";

export const userApi = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<PartialUserProps, void>({
      query: () => `/auth`,
      providesTags: (result, error, arg) => [{ type: "User", id: result?.id }],
    }),
    createUser: builder.mutation<
      { success: boolean; message: string },
      PartialUserProps
    >({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...user },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      { success: boolean; message: string },
      PartialUserProps
    >({
      query: (user) => ({
        url: "/auth/update-profile",
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
        url: `/photos/upload`,
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
  }),
  overrideExisting: true,
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadUserImageMutation,
} = userApi;
