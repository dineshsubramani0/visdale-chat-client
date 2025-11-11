import { decrypt, encrypt } from '@/lib/encryption';
import axios, { type InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// -------------------- Request Interceptor --------------------
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Encrypt body as string
    if (config.data) {
      config.data = {data: encrypt(config.data)};
    }

    // Encrypt query params as string
    if (config.params) {
      const encrypted = encrypt(config.params);
      config.params = { data: encodeURIComponent(encrypted) };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'string') {
      const decrypted = decrypt(response.data);
      return { ...response, data: decrypted ?? response.data };
    }
    return response;
  },
  (error) => Promise.reject(error),
);

export default client;
