import { apiClient } from './client';
import type { Sermon, PaginatedResponse } from '@/types';

export interface SermonQuery {
  page?: number;
  perPage?: number;
  search?: string;
  type?: 'audio' | 'video';
  categoryId?: string;
  seriesId?: string;
  isPublished?: boolean;
}

export const sermonsApi = {
  list: (query: SermonQuery = {}) =>
    apiClient
      .get<{ data: Sermon[]; meta: PaginatedResponse<Sermon>['meta'] }>('/admin/sermons', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Sermon }>(`/admin/sermons/${id}`).then((r) => r.data.data),

  create: (data: Partial<Sermon>) =>
    apiClient.post<{ data: Sermon }>('/admin/sermons', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Sermon>) =>
    apiClient.put<{ data: Sermon }>(`/admin/sermons/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/sermons/${id}`),

  togglePublish: (id: string) =>
    apiClient.put<{ data: Sermon }>(`/admin/sermons/${id}/publish`).then((r) => r.data.data),
};
