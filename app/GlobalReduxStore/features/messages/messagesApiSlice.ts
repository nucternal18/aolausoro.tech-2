"use client";
import { messageApiSlice } from "app/GlobalReduxStore/api";
import { IMessageData } from "types/types";

export const messagesApi = messageApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<IMessageData[], void>({
      query: () => "/contact",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Message" as const, id }))]
          : [{ type: "Message", id: "LIST" }],
    }),
    getMessage: builder.query<IMessageData, string>({
      query: (id) => `/contact/${id}`,
      providesTags: (result) => [{ type: "Message", id: result?.id }],
    }),
    createMessage: builder.mutation<
      { success: boolean; message: string },
      IMessageData
    >({
      query: (message) => ({
        url: "/contact/create-message",
        method: "POST",
        body: { ...message },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Message", id: "LIST" },
      ],
    }),
    deleteMessage: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Message", id: "LIST" },
      ],
    }),
    sendMail: builder.mutation<
      { success: boolean; message: string },
      IMessageData
    >({
      query: (message) => ({
        url: "/contact/send-mail",
        method: "POST",
        body: { ...message },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Message", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessageQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useSendMailMutation,
} = messagesApi;
