export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type NotifyOptions = {
  id?: string;
  duration?: number;
  pauseOnHover?: boolean;
};

export type ToastPayload = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  pauseOnHover: boolean;
};

export const TOAST_EVENT = 'app-toast';

export function notify(
  message: string,
  type: ToastType = 'info',
  options: NotifyOptions = {}
) {
  const id =
    options.id ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const payload: ToastPayload = {
    id,
    message,
    type,
    duration: options.duration ?? 4000,
    pauseOnHover: options.pauseOnHover ?? true,
  };

  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }));
  }

  return id;
}

export function removeToastById(id: string) {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent(`${TOAST_EVENT}-remove`, { detail: id })
    );
  }
}
