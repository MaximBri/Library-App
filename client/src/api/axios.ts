import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type FailedRequest = {
  resolve: (value?: unknown) => void
  reject: (error: unknown) => void
  config: AxiosRequestConfig
}

let accessToken: string | null = null // in-memory
export const setAccessToken = (token: string | null) => {
  accessToken = token
}
export const getAccessToken = () => accessToken

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important to send/receive httpOnly refresh cookie
})

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {}
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// refresh single-flight
let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: never, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else {
      if (token && prom.config.headers)
        prom.config.headers.Authorization = `Bearer ${token}`
      prom.resolve(api.request(prom.config))
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = err.config
    if (!originalConfig) return Promise.reject(err)

    if (err.response?.status === 401 && !originalConfig._retry) {
      // mark to avoid infinite loop
      originalConfig._retry = true

      if (isRefreshing) {
        // queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig })
        })
      }

      isRefreshing = true

      try {
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newAccessToken = response.data?.accessToken as string | undefined
        if (!newAccessToken)
          throw new Error('No access token in refresh response')

        setAccessToken(newAccessToken)
        processQueue(null, newAccessToken)
        return api.request(originalConfig)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // optionally: redirect to login (but do not inside this module)
        setAccessToken(null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
