import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axios';

export const syncToCRM = createAsyncThunk('sync-user', async () => {
  try {
    await axios.post('/hubspot/sync-user/me');
  } catch (error: any) {}
});

export const login = createAsyncThunk(
  'login',
  async (
    {
      data: { email, password },
      onLoading,
      onError,
    }: {
      data: { email: string; password: string };
      onLoading: Function;
      onError: Function;
    },
    { rejectWithValue },
  ) => {
    try {
      if (onLoading) onLoading(true);
      const data: { token: string } = await axios.post('/auth/login', {
        email,
        password,
        from: 'client',
      });
      if (onLoading) onLoading(false);
      if (onError) onError(null);
      return data;
    } catch (error: any) {
      const message = error.message || 'Something went wrong.';
      if (onLoading) onLoading(false);
      if (onError) onError(error.message);
      return rejectWithValue(message);
    }
  },
);

export const signUp = createAsyncThunk(
  'signUp',
  async (
    {
      data: {
        firstName,
        lastName,
        email,
        country,
        phoneNumber,
        password,
        paymentMethod,
        paymentAmount,
        referralCode,
      },
      onLoading,
      onError,
    }: {
      data: {
        firstName: string;
        lastName: string;
        email: string;
        country?: string;
        phoneNumber: string;
        password: string;
        paymentMethod: string;
        paymentAmount: number;
        referralCode?: string;
      };
      onLoading: Function;
      onError: Function;
    },
    { rejectWithValue },
  ) => {
    try {
      if (onLoading) onLoading(true);
      const data: { token: string } = await axios.post('/auth/sign-up', {
        firstName,
        lastName,
        email,
        country,
        phoneNumber,
        password,
        paymentMethod,
        paymentAmount,
        referralCode,
      });
      if (onLoading) onLoading(false);
      if (onError) onError(null);
      return data;
    } catch (error: any) {
      const message = error.message || 'Something went wrong.';
      if (onLoading) onLoading(false);
      if (onError) onError(error.message);
      return rejectWithValue(message);
    }
  },
);
