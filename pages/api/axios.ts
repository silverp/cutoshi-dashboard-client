import { API_BASE_URL } from '@/config';
import { RESET_STORE } from '@/store';
import { store } from '@/store';
import axios, { AxiosError } from 'axios';
import { SHOULD_NOT_SHOW_ERROR } from '@/helpers/toast';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = `application/json`;

  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data }: any = error.response;
      if (status === 401) {
        store.dispatch({ type: RESET_STORE });
        return Promise.reject(new Error(SHOULD_NOT_SHOW_ERROR));
      } else {
        if (data?.errors && !data?.message) {
          return Promise.reject(new Error(data?.errors?.[0]?.msg || 'Something went wrong.'));
        }

        return Promise.reject(new Error((data as any)?.message || 'Something went wrong.'));
      }
    } else {
      return Promise.reject(new Error('Something went wrong.'));
    }
  },
);
export default instance;
