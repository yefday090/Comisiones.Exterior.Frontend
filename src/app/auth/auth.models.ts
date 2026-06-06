export interface LoginRequest {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  roles: string[];
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
