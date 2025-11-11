export interface RequestOtpDto {
  email: string;
  first_name: string;
  last_name: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface RegisterDto {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

// Response data
export interface RequestOtpResponse {
  email: string;
  message: string;
}

export interface VerifyOtpResponse {
  email: string;
  message: string;
}

export interface RegisterResponse {
  email: string;
  message: string;
}
