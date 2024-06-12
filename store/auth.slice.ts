import { login, signUp } from '@/pages/api/auth.api';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  status: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initSlice: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });
  },
});

export const { initSlice } = authSlice.actions;
export default authSlice.reducer;
