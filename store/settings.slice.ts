import { getConstants } from '@/pages/api/settings.api';
import { Constants } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
export interface SettingsState {
  constants: Constants;
  language: string;
}

export const initialState: SettingsState = {
  language: 'gb',
  constants: {
    userStatus: [],
    userRole: [],
    paymentStatus: [],
    paymentType: [],
    promoStatus: [],
    airdropStatus: [],
    airdropOrderStatus: [],
    programStatus: [],
    durationUnit: [],
    yieldPayment: [],
    depositStatus: [],
    depositType: [],
    noteStatus: [],
    action: [],
    stageStatus: [],
    bonusStatus: [],
    countries: [],
    currencies: [],
  },
};

export const settingsSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    initSlice: (state) => {
      state.constants = initialState.constants;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConstants.fulfilled, (state, action) => {
      state.constants = action.payload as any;
    });
  },
});

export const { initSlice, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
