import { apiClient } from './client';
import type { User, PaginatedResponse } from '@/types';

export interface UserQuery {
  page?: number;
  perPage?: number;
  search?: string;
  gender?: string;
  churchMember?: boolean;
  isAdmin?: boolean;
  emailVerified?: boolean;
  churchCentreId?: string;
}

export const usersApi = {
  list: (query: UserQuery = {}) =>
    apiClient
      .get<{ data: User[]; meta: PaginatedResponse<User>['meta'] }>('/admin/users', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: User }>(`/admin/users/${id}`).then((r) => r.data.data),

  create: (data: Partial<User> & { password: string }) =>
    apiClient.post<{ data: User }>('/admin/users', data).then((r) => r.data.data),

  update: (id: string, data: Partial<User> & { password?: string }) =>
    apiClient.put<{ data: User }>(`/admin/users/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/users/${id}`),

  toggleAdmin: (id: string) =>
    apiClient.put<{ data: User }>(`/admin/users/${id}/toggle-admin`).then((r) => r.data.data),
};
