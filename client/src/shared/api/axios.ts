import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
};

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  return config;
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else {
      prom.resolve(api.request(prom.config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = err.config;
    if (!originalConfig) return Promise.reject(err);
    if(err.response?.statusText !== 'Unauthorized') return;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return api.request(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
