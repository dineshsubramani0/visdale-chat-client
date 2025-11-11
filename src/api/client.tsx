import { decrypt, encrypt } from '@/lib/encryption';
import axios, { type InternalAxiosRequestConfig } from 'axios';

// Utility to decode JWT without verifying
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// Check if JWT access token is expired
function isAccessTokenExpired(token: string) {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
}

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// -------------------- Request Interceptor --------------------
client.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // Encrypt body
    if (config.data) {
      config.data = { data: encrypt(config.data) };
    }

    // Encrypt query params
    if (config.params) {
      const encrypted = encrypt(config.params);
      config.params = { data: encodeURIComponent(encrypted) };
    }

    let token: string | null = sessionStorage.getItem('access_token');

    if (token && isAccessTokenExpired(token)) {
      try {
        // Call refresh endpoint using cookie (_rt)
        const response = await axios.post(
          '/auth/refresh',
          {},
          { withCredentials: true, baseURL: import.meta.env.VITE_AUTH_API_URL }
        );
        token = response.data.access_token;
        if (token) sessionStorage.setItem('access_token', token);
      } catch (err) {
        console.error('Failed to refresh token', err);
        sessionStorage.removeItem('access_token');
        token = null;
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
    if (response.data && typeof response.data === 'string') {
      const decrypted = decrypt(response.data);
      return { ...response, data: decrypted ?? response.data };
    }
    return response;
  },
  async (error) => {
    throw error;
  }
);

export default client;
