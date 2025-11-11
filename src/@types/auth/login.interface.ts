// Interface for login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface for the access token object in response
export interface LoginData {
  access_token: string;
}

// Interface for full login response
export interface LoginResponse {
  status_code: number;
  access_token: string;
  time_stamp: string; // ISO date string
}
