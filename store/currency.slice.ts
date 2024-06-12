import {
  getCurrentBonus,
  getCurrentPrice,
  getCurrentStage,
  getCurrentStageRaised,
} from '@/pages/api/currency.api';
import { CurrentBonus, CurrentStage } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

export interface CurrencyState {
  isEnded: boolean;
  currentStage: CurrentStage;
  currentStageRaised: number;
  currentBonus?: CurrentBonus;

  currencyPrices: {
    ETH: number;
    BNBBSC: number;
    USDTERC20: number;
    USDTTRC20: number;
    BTC: number;
    BNBMAINNET: number;
    DOGE: number;
    SHIB: number;
    SOL: number;
    SAND: number;
    MANA: number;
  };
}

export const initialState: CurrencyState = {
  isEnded: false,
  currentStage: {
    name: 'Stage 0',
    minPurchase: 0,
    maxPurchase: 0,
    price: 0,
    amount: 0,
    raise: 0,
  },
  currentStageRaised: 0,
  currentBonus: undefined,

  currencyPrices: {
    ETH: 0,
    BNBBSC: 0,
    USDTERC20: 0,
    USDTTRC20: 0,
    BTC: 0,
    BNBMAINNET: 0,
    DOGE: 0,
    SHIB: 0,
    SOL: 0,
    SAND: 0,
    MANA: 0,
  },
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentBonus.fulfilled, (state, action) => {
      state.currentBonus = action.payload;
    });
    builder.addCase(getCurrentStage.fulfilled, (state, action) => {
      state.currentStage = action.payload ?? initialState.currentStage;
    });
    builder.addCase(getCurrentStage.rejected, (state, action) => {
      state.isEnded = true;
    });
    builder.addCase(getCurrentStageRaised.fulfilled, (state, action) => {
      state.currentStageRaised = action.payload ?? 0;
    });
    builder.addCase(getCurrentPrice.fulfilled, (state, action) => {
      if (action.payload) {
        state.currencyPrices = {
          ...state.currencyPrices,
          [action.payload.currency.toUpperCase()]: action.payload.value,
        };
      }
    });
  },
});

export const {} = currencySlice.actions;
export default currencySlice.reducer;
