import { apiClient } from './client';
import type { User, AuthTokens } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface ServerLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    apiClient
      .post<{ data: ServerLoginResponse }>('/auth/login', payload)
      .then((r) => ({
        user: r.data.data.user,
        tokens: {
          accessToken: r.data.data.accessToken,
          refreshToken: r.data.data.refreshToken,
        },
      })),

  me: () =>
    apiClient.get<{ data: User }>('/auth/profile').then((r) => r.data.data),
};
