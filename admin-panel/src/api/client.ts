import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401 (skip for auth endpoints to let errors propagate to the UI)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token'];

apiClient.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !((error.config as unknown as { _retry?: boolean })._retry) &&
      !AUTH_ENDPOINTS.some((ep) => error.config?.url?.includes(ep))
    ) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post<{ data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh-token`,
          { refreshToken },
        );

        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        if (error.config) {
          (error.config as unknown as { _retry?: boolean })._retry = true;
          error.config.headers = error.config.headers ?? {};
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(error.config);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string })?.message;
    return msg ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
