// src/hooks/use-auth-api.ts
import type { BaseApiResponse } from '@/@types/api/api.interface';
import type {
  LoginRequest,
  LoginResponse,
} from '@/@types/auth/login.interface';
import type {
  RequestOtpDto,
  RequestOtpResponse,
  VerifyOtpDto,
  VerifyOtpResponse,
  RegisterDto,
  RegisterResponse,
} from '@/@types/auth/register.interface';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { useApi } from '@/hooks/use-api';

export const useAuthApi = () => {
  const { fetchData } = useApi();
  const BASE_URL = import.meta.env.VITE_AUTH_API_URL;

  return {
    requestOtp: async (
      payload: RequestOtpDto
    ): Promise<BaseApiResponse<RequestOtpResponse> | null> => {
      return fetchData<BaseApiResponse<RequestOtpResponse>>(
        `${BASE_URL}/auth/request-otp`,
        'POST',
        '',
        payload
      );
    },

    verifyOtp: async (
      payload: VerifyOtpDto
    ): Promise<BaseApiResponse<VerifyOtpResponse> | null> => {
      return fetchData<BaseApiResponse<VerifyOtpResponse>>(
        `${BASE_URL}/auth/verify-otp`,
        'POST',
        '',
        payload
      );
    },

    register: async (
      payload: RegisterDto
    ): Promise<BaseApiResponse<RegisterResponse> | null> => {
      return fetchData<BaseApiResponse<RegisterResponse>>(
        `${BASE_URL}/auth/register`,
        'POST',
        '',
        payload
      );
    },

    login: async (
      payload: LoginRequest
    ): Promise<BaseApiResponse<LoginResponse> | null> => {
      return fetchData<BaseApiResponse<LoginResponse>>(
        `${BASE_URL}/auth/login`,
        'POST',
        '',
        payload
      );
    },

    me: async (): Promise<BaseApiResponse<UserProfile> | null> => {
      return fetchData<BaseApiResponse<UserProfile>>(
        `${BASE_URL}/auth/me`,
        'GET',
        ''
      );
    },

    logout: async (): Promise<BaseApiResponse<{ message: string }> | null> => {
      return fetchData<BaseApiResponse<{ message: string }>>(
        `${BASE_URL}/auth/logout`,
        'POST',
        ''
      );
    },
  };
};
