// client.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { encrypt, decrypt } from '@/lib/encryption';

// -------------------- JWT Utilities --------------------
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token: string) {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

// -------------------- Axios Client --------------------
const client = axios.create({
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

// -------------------- Token Refresh Queue --------------------
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// -------------------- Request Interceptor --------------------
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Encrypt body
    if (config.data) config.data = { data: encrypt(config.data) };

    // Encrypt query params
    if (config.params)
      config.params = { data: encodeURIComponent(encrypt(config.params)) };

    let token: string | null = sessionStorage.getItem('access_token');

    if (token && isAccessTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post(
            '/auth/refresh',
            {},
            {
              withCredentials: true,
              baseURL: import.meta.env.VITE_AUTH_API_URL,
            }
          );

          const newToken = response.data?.access_token;
          if (newToken) {
            sessionStorage.setItem('access_token', newToken);
            token = newToken;
            onRefreshed(newToken);
          } else {
            sessionStorage.removeItem('access_token');
            token = null;
            onRefreshed('');
          }
        } catch (error) {
          sessionStorage.removeItem('access_token');
          token = null;
          onRefreshed('');
          console.log(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for ongoing refresh to finish
        token = await new Promise<string>((resolve) =>
          subscribeTokenRefresh(resolve)
        );
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- Response Interceptor --------------------
client.interceptors.response.use(
  (response) => {
    // Decrypt string responses
    if (response.data && typeof response.data === 'string') {
      const decrypted = decrypt(response.data);
      return { ...response, data: decrypted ?? response.data };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry 401 once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post(
            '/auth/refresh',
            {},
            {
              withCredentials: true,
              baseURL: import.meta.env.VITE_AUTH_API_URL,
            }
          );
          const newToken = response.data?.access_token;
          if (newToken) {
            sessionStorage.setItem('access_token', newToken);
            onRefreshed(newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch (err) {
          sessionStorage.removeItem('access_token');
          onRefreshed('');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for ongoing refresh
        const token = await new Promise<string>((resolve) =>
          subscribeTokenRefresh(resolve)
        );
        if (token) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return client(originalRequest);
        }
      }
    }

    throw error;
  }
);

export default client;
