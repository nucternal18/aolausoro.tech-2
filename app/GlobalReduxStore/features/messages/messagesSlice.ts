"use client";
import type { PartialMessageProps } from "schema/Message";
import type { RootState } from "../../store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
  messages: PartialMessageProps[] | null;
  error: { name: string; message: string } | null;
}

export const initialState: MessageState = {
  messages: null,
  error: null,
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, { payload }: PayloadAction<PartialMessageProps[]>) => {
      state.messages = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setMessages, setError } = messageSlice.actions;

export const selectMessages = (state: RootState) => state.messages.messages;
export const messageSelector = (state: RootState) => state.messages;

export default messageSlice.reducer;
