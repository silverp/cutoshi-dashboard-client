import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axios';
import { Constants } from '@/types';

export const getConstants = createAsyncThunk('constants', async () => {
  try {
    const data: Constants = await axios.get('/settings/constants');
    return data;
  } catch (error: any) {}
});
