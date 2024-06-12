import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axios';
import { CurrentBonus, CurrentStage } from '@/types';

export const getCurrentBonus = createAsyncThunk('current-bonuses', async () => {
  try {
    const data: CurrentBonus = await axios.get('/bonuses/current-bonus');
    return data;
  } catch (error: any) {}
});

export const getCurrentStage = createAsyncThunk('current-stage', async (_, { rejectWithValue }) => {
  try {
    const data: CurrentStage = await axios.get('/stages/current-stage');
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const getCurrentStageRaised = createAsyncThunk(
  'current-stage-raised',
  async (_, { rejectWithValue }) => {
    try {
      const data: number = await axios.get('/stages/current-stage-raised');
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

export const getCurrentPrice = createAsyncThunk('currency-price', async (currency: string) => {
  try {
    const data: number = await axios.get(`/currencies/${currency}`);
    return { currency, value: data };
  } catch (error: any) {}
});
