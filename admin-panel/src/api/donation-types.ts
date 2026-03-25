import { apiClient } from './client';
import type { DonationType, PaginatedResponse } from '@/types';

export const donationTypesApi = {
  list: (query: { page?: number; perPage?: number; search?: string } = {}) =>
    apiClient
      .get<{ data: DonationType[]; meta: PaginatedResponse<DonationType>['meta'] }>('/admin/donation-types', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DonationType }>(`/admin/donation-types/${id}`).then((r) => r.data.data),

  create: (data: Partial<DonationType>) =>
    apiClient.post<{ data: DonationType }>('/admin/donation-types', data).then((r) => r.data.data),

  update: (id: string, data: Partial<DonationType>) =>
    apiClient.put<{ data: DonationType }>(`/admin/donation-types/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/donation-types/${id}`),
};
