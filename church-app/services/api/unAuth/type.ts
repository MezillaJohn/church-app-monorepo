export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  country?: string | null;
  churchMember?: boolean | null;
  churchCentreId?: string | null;
  isAdmin?: boolean;
  emailVerifiedAt?: string | null;
  profileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface unAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  password: string;
  email: string;
}

export interface EmailRequest {
  email: string;
}

export interface VerifyEmailRes {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
  };
}

export interface VerifyEmailRequest extends EmailRequest {
  code: string;
}

export interface RequestCodeRequest extends EmailRequest {
  name: string;
}

export interface SetPassowrd {
  email: string;
  password: string;
  password_confirmation: string;
  code?: string;
}
