import { ToastContent, ToastOptions, toast } from 'react-toastify';

export const SHOULD_NOT_SHOW_ERROR = '@SHOULD_NOT_SHOW_ERROR';

const customToast = (content: ToastContent<unknown>, options?: ToastOptions<{}> | undefined) => {
  if (content !== SHOULD_NOT_SHOW_ERROR) {
    toast(content, {
      pauseOnFocusLoss: false,
      ...options,
    });
  }
};

export default customToast;
