import { getBalance, getReferralOverview, getUser } from '@/pages/api/account.api';
import { Balance, ReferralOverView, User } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

export interface AccountState {
  user?: User;
  balance: Balance;
  referralOverView: ReferralOverView;
}

export const initialState: AccountState = {
  balance: {
    balance: 0,
    refBalance: 0,
    bonusBalance: 0,
  },
  referralOverView: { referralIncome: 0, referralPercentage: 0, referrals: 0 },
};

export const settingsSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    initSlice: (state) => {
      state.user = initialState.user;
      state.balance = initialState.balance;
      state.referralOverView = initialState.referralOverView;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload as User;
    });
    builder.addCase(getBalance.fulfilled, (state, action) => {
      state.balance = action.payload as Balance;
    });
    builder.addCase(getReferralOverview.fulfilled, (state, action) => {
      state.referralOverView = action.payload as ReferralOverView;
    });
  },
});

export const { initSlice } = settingsSlice.actions;
export default settingsSlice.reducer;
