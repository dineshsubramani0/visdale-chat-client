// src/store/socketSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SOCKET_SLICE_NAME } from './socket.constant';

interface SocketState {
  onlineUsers: string[];
  typingUsers: Record<string, string>;
}

const initialState: SocketState = {
  onlineUsers: [],
  typingUsers: {},
};

const socketSlice = createSlice({
  name: SOCKET_SLICE_NAME,
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    setTypingUser(
      state,
      action: PayloadAction<{ chatId: string; userName: string | null }>
    ) {
      const { chatId, userName } = action.payload;
      if (userName) state.typingUsers[chatId] = userName;
      else delete state.typingUsers[chatId];
    },
  },
});

export const { setOnlineUsers, setTypingUser } = socketSlice.actions;
export default socketSlice.reducer;
