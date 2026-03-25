import { apiClient } from './client';
import type { Partnership, PaginatedResponse } from '@/types';

export interface PartnershipQuery {
  page?: number;
  perPage?: number;
  search?: string;
  partnershipTypeId?: string;
  interval?: string;
  userId?: string;
}

export const partnershipsApi = {
  list: (query: PartnershipQuery = {}) =>
    apiClient
      .get<{ data: Partnership[]; meta: PaginatedResponse<Partnership>['meta'] }>('/admin/partnerships', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Partnership }>(`/admin/partnerships/${id}`).then((r) => r.data.data),

  create: (data: Partial<Partnership>) =>
    apiClient.post<{ data: Partnership }>('/admin/partnerships', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Partnership>) =>
    apiClient.put<{ data: Partnership }>(`/admin/partnerships/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/partnerships/${id}`),
};
