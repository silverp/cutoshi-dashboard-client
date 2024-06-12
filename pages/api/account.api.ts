import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axios';
import { Balance, ReferralOverView, User } from '@/types';

export const getUser = createAsyncThunk('user', async () => {
  try {
    const data: { user: User } = await axios.get('/users/me');
    return data.user;
  } catch (error: any) {}
});

export const getBalance = createAsyncThunk('balance', async () => {
  try {
    const data: Balance = await axios.get('/users/me/balance');
    return data;
  } catch (error: any) {}
});

export const getReferralOverview = createAsyncThunk('referral-overview', async () => {
  try {
    const data: ReferralOverView = await axios.get('/users/me/referral-overview');
    return data;
  } catch (error: any) {}
});
