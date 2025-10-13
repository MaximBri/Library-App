import { toast, type ToastOptions } from 'react-hot-toast';

export type NotifyType = 'success' | 'error' | 'info' | 'loading';

const baseOpts: ToastOptions = {
  duration: 4000,
};

export const notify = (text: string, type: NotifyType = 'info', opts?: ToastOptions) => {
  const options: ToastOptions = { ...baseOpts, ...opts };

  switch (type) {
    case 'success':
      return toast.success(text, options);
    case 'error':
      return toast.error(text, options);
    case 'loading':
      return toast.loading(text, { ...options, duration: Infinity });
    case 'info':
    default:
      return toast(text, options);
  }
};
