import { apiClient } from './client';
import type { ChurchCentre, PaginatedResponse } from '@/types';

export const churchCentresApi = {
  list: (query: { page?: number; perPage?: number; search?: string } = {}) =>
    apiClient
      .get<{ data: ChurchCentre[]; meta: PaginatedResponse<ChurchCentre>['meta'] }>('/admin/church-centres', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: ChurchCentre }>(`/admin/church-centres/${id}`).then((r) => r.data.data),

  create: (data: Partial<ChurchCentre>) =>
    apiClient.post<{ data: ChurchCentre }>('/admin/church-centres', data).then((r) => r.data.data),

  update: (id: string, data: Partial<ChurchCentre>) =>
    apiClient.put<{ data: ChurchCentre }>(`/admin/church-centres/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/church-centres/${id}`),
};
