import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  onlineUsers: string[];
  typingUsers: Record<string, string | null>; // chatId -> userName
}

const initialState: SocketState = {
  onlineUsers: [],
  typingUsers: {},
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setTypingUser: (
      state,
      action: PayloadAction<{ chatId: string; userName: string | null }>
    ) => {
      const { chatId, userName } = action.payload;
      if (userName) state.typingUsers[chatId] = userName;
      else delete state.typingUsers[chatId];
    },
  },
});

export const { setOnlineUsers, setTypingUser } = socketSlice.actions;
export default socketSlice.reducer;
