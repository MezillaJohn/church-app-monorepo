import { apiClient } from './client';
import type { SermonSeries, PaginatedResponse } from '@/types';

export interface SeriesQuery {
  page?: number;
  perPage?: number;
  search?: string;
}

export const seriesApi = {
  list: (query: SeriesQuery = {}) =>
    apiClient
      .get<{ data: SermonSeries[]; meta: PaginatedResponse<SermonSeries>['meta'] }>('/admin/series', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: SermonSeries }>(`/admin/series/${id}`).then((r) => r.data.data),

  create: (data: Partial<SermonSeries>) =>
    apiClient.post<{ data: SermonSeries }>('/admin/series', data).then((r) => r.data.data),

  update: (id: string, data: Partial<SermonSeries>) =>
    apiClient.put<{ data: SermonSeries }>(`/admin/series/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/series/${id}`),
};
