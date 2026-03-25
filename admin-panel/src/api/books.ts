import { apiClient } from './client';
import type { Book, PaginatedResponse } from '@/types';

export interface BookQuery {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export const booksApi = {
  list: (query: BookQuery = {}) =>
    apiClient
      .get<{ data: Book[]; meta: PaginatedResponse<Book>['meta'] }>('/admin/books', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Book }>(`/admin/books/${id}`).then((r) => r.data.data),

  create: (data: Partial<Book>) =>
    apiClient.post<{ data: Book }>('/admin/books', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Book>) =>
    apiClient.put<{ data: Book }>(`/admin/books/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/books/${id}`),

  togglePublish: (id: string) =>
    apiClient.put<{ data: Book }>(`/admin/books/${id}/publish`).then((r) => r.data.data),
};
