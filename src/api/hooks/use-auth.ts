// src/hooks/use-auth-mutations.ts
import { useAuthApi } from '@/api/endpoints/auth-api.endpoint';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { BaseApiResponse } from '@/@types/api/api.interface';
import type {
  RequestOtpResponse,
  RequestOtpDto,
  VerifyOtpResponse,
  VerifyOtpDto,
  RegisterResponse,
  RegisterDto,
} from '@/@types/auth/register.interface';
import type {
  LoginResponse,
  LoginRequest,
} from '@/@types/auth/login.interface';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { logout } from '@/lib/logout';

export const useAuth = () => {
  const {
    requestOtp,
    verifyOtp,
    register,
    login,
    me,
    logout: serviceLogout,
  } = useAuthApi();

  // -------------------- Request OTP --------------------
  const requestOtpMutation = useMutation<
    BaseApiResponse<RequestOtpResponse>,
    Error,
    RequestOtpDto
  >({
    mutationKey: ['auth_request_otp'],
    mutationFn: async (payload) => {
      const response = await requestOtp(payload);
      if (!response) throw new Error('No response from API');
      return response;
    },
  });

  // -------------------- Verify OTP --------------------
  const verifyOtpMutation = useMutation<
    BaseApiResponse<VerifyOtpResponse>,
    Error,
    VerifyOtpDto
  >({
    mutationKey: ['auth_verify_otp'],
    mutationFn: async (payload) => {
      const response = await verifyOtp(payload);
      if (!response) throw new Error('No response from API');
      return response;
    },
  });

  // -------------------- Register --------------------
  const registerMutation = useMutation<
    BaseApiResponse<RegisterResponse>,
    Error,
    RegisterDto
  >({
    mutationKey: ['auth_register'],
    mutationFn: async (payload) => {
      const response = await register(payload);
      if (!response) throw new Error('No response from API');
      return response;
    },
  });

  // -------------------- Login --------------------
  const loginMutation = useMutation<
    BaseApiResponse<LoginResponse>,
    Error,
    LoginRequest
  >({
    mutationKey: ['auth_login'],
    mutationFn: async (payload) => {
      const response = await login(payload);
      if (!response) throw new Error('No response from API');
      return response;
    },
  });

  // -------------------- Get User Profile --------------------
  const meQuery = useQuery<BaseApiResponse<UserProfile> | null>({
    queryKey: ['auth_me'],
    queryFn: async () => {
      const response = await me();
      if (!response) throw new Error('No response from API');
      return response;
    },
    enabled: !!localStorage.getItem('access_token'),
  });

  // -------------------- Logout --------------------
  const logoutMutation = useMutation({
    mutationKey: ['auth_logout'],
    mutationFn: async () => {
      const response = await serviceLogout();
      if (!response) throw new Error('No response from API');
      logout();
      return response;
    },
  });

  return {
    requestOtpMutation,
    verifyOtpMutation,
    registerMutation,
    loginMutation,
    meQuery,
    logoutMutation,
  };
};
