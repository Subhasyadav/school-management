import axios, { type InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRefreshRequest?: boolean;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  // headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshFailed = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 1️⃣ Never retry a refresh request that failed
    if (originalRequest._isRefreshRequest) {
      return Promise.reject(error);
    }

    // 2️⃣ If not a 401, already retried, or refresh already failed → reject (and redirect if needed)
    if (error.response?.status !== 401 || originalRequest || refreshFailed) {
      if (error.response?.status === 401 && refreshFailed) {
        localStorage.removeItem('isLoggedIn');           // 👈 clear flag
        window.location.replace('/login');
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch(err => Promise.reject(err));
    }

    // originalRequest = true;
    isRefreshing = true;

    try {
      await apiClient.post('/auth/refresh', null, {
        _isRefreshRequest: true,
      } as CustomAxiosRequestConfig);
      
      refreshFailed = false;
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      refreshFailed = true;
      processQueue(refreshError);
      localStorage.removeItem('isLoggedIn');             // 👈 clear flag
      window.location.replace('/login');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;