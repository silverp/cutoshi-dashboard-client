import '@/styles/globals.css';
import 'flag-icons/css/flag-icons.min.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ToastContainer />
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </I18nextProvider>
      </Provider>
    </>
  );
}
