import { apiClient } from './client';
import type { PartnershipType, PaginatedResponse } from '@/types';

export const partnershipTypesApi = {
  list: (query: { page?: number; perPage?: number; search?: string } = {}) =>
    apiClient
      .get<{ data: PartnershipType[]; meta: PaginatedResponse<PartnershipType>['meta'] }>('/admin/partnership-types', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: PartnershipType }>(`/admin/partnership-types/${id}`).then((r) => r.data.data),

  create: (data: Partial<PartnershipType>) =>
    apiClient.post<{ data: PartnershipType }>('/admin/partnership-types', data).then((r) => r.data.data),

  update: (id: string, data: Partial<PartnershipType>) =>
    apiClient.put<{ data: PartnershipType }>(`/admin/partnership-types/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/partnership-types/${id}`),
};
