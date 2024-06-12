import {
  configureStore,
  combineReducers,
  ThunkDispatch,
  Action,
  AnyAction,
} from '@reduxjs/toolkit';
// base slices
import authSlice, { AuthState, initialState as auth } from './auth.slice';
import accountSlice, { AccountState, initialState as account } from './account.slice';
import settingsSlice, { SettingsState, initialState as settings } from './settings.slice';
import currencySlice, { CurrencyState, initialState as currency } from './currency.slice';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface RootState {
  auth: AuthState;
  account: AccountState;
  settings: SettingsState;
  currency: CurrencyState;
}

const initialState: RootState = {
  auth: { ...auth },
  currency: { ...currency },
  account: { ...account },
  settings: { ...settings },
};

const appReducer = combineReducers<RootState>({
  auth: authSlice,
  currency: currencySlice,
  account: accountSlice,
  settings: settingsSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'settings', 'account', 'currency'],
};

export const RESET_STORE = 'RESET_STORE';

const rootReducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === RESET_STORE) {
    storage.removeItem('persist:root');
    state = initialState;
  }

  return appReducer(state, action);
};

export type AppDispatch = ThunkDispatch<RootState, void, Action>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create your Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  preloadedState: initialState,
});

export const persistor = persistStore(store);
