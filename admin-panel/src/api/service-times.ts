import { apiClient } from './client';
import type { ServiceTime, PaginatedResponse } from '@/types';

export const serviceTimesApi = {
  list: (query: { page?: number; perPage?: number } = {}) =>
    apiClient
      .get<{ data: ServiceTime[]; meta: PaginatedResponse<ServiceTime>['meta'] }>('/admin/service-times', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: ServiceTime }>(`/admin/service-times/${id}`).then((r) => r.data.data),

  create: (data: Partial<ServiceTime>) =>
    apiClient.post<{ data: ServiceTime }>('/admin/service-times', data).then((r) => r.data.data),

  update: (id: string, data: Partial<ServiceTime>) =>
    apiClient.put<{ data: ServiceTime }>(`/admin/service-times/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/service-times/${id}`),
};
