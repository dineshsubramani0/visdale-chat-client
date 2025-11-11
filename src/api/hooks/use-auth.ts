// src/hooks/use-auth-mutations.ts
import { useAuthApi } from '@/api/endpoints/auth-api.endpoint';
import { useMutation } from '@tanstack/react-query';

import type { BaseApiResponse } from '@/@types/api/api.interface';
import type {
  RequestOtpResponse,
  RequestOtpDto,
  VerifyOtpResponse,
  VerifyOtpDto,
  RegisterResponse,
  RegisterDto,
} from '@/@types/auth/register.interface';

export const useAuth = () => {
  const { requestOtp, verifyOtp, register } = useAuthApi();

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

  return {
    requestOtpMutation,
    verifyOtpMutation,
    registerMutation,
  };
};
