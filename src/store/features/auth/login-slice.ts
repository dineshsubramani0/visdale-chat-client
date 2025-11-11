import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LOGIN_SLICE_NAME } from './auth-constant';
import type { LoginResponse } from '@/@types/auth/login.interface';

export const loginInitialState: LoginResponse = {
  email: '',
  password: '',
  name: '',
};

const loginSlice = createSlice({
  name: LOGIN_SLICE_NAME,
  initialState: loginInitialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.name = action.payload.name;
    },

    logout(state) {
      state.email = '';
      state.password = '';
    },
  },
});

export const { loginSuccess, logout } = loginSlice.actions;
export default loginSlice.reducer;
