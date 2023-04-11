import { AppDispatch, RootState } from "../../store";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { IMessageData } from "lib/types";

interface MessageState {
  messages: IMessageData[] | null;
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
    setMessages: (state, { payload }: PayloadAction<IMessageData[]>) => {
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
