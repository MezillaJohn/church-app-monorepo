import { apiClient } from './client';
import type { Category, PaginatedResponse } from '@/types';

export interface CategoryQuery {
  page?: number;
  perPage?: number;
  search?: string;
  type?: 'sermon' | 'book' | 'giving';
}

export interface CategoryPayload {
  name: string;
  slug: string;
  type: 'sermon' | 'book' | 'giving';
  description?: string;
  isActive?: boolean;
}

export const categoriesApi = {
  list: (query: CategoryQuery = {}) =>
    apiClient
      .get<{ data: Category[]; meta: PaginatedResponse<Category>['meta'] }>('/admin/categories', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Category }>(`/admin/categories/${id}`).then((r) => r.data.data),

  create: (data: CategoryPayload) =>
    apiClient.post<{ data: Category }>('/admin/categories', data).then((r) => r.data.data),

  update: (id: string, data: Partial<CategoryPayload>) =>
    apiClient.put<{ data: Category }>(`/admin/categories/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/categories/${id}`),
};
