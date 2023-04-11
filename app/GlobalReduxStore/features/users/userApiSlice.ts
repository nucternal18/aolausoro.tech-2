import { userApiSlice } from "app/GlobalReduxStore/api";
import { UserInfoProps } from "lib/types";
import { setError, setUserState, setImage } from "./usersSlice";

export const userApi = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserInfoProps, void>({
      query: () => `/auth`,
      providesTags: (result, error, arg) => [{ type: "User", id: result?.id }],
    }),
    createUser: builder.mutation<
      { success: boolean; message: string },
      UserInfoProps
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
      UserInfoProps
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
