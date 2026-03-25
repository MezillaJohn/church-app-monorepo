import { apiClient } from './client';
import type { Donation, PaginatedResponse } from '@/types';

export interface DonationQuery {
  page?: number;
  perPage?: number;
  search?: string;
  userId?: string;
  donationTypeId?: string;
  paymentMethod?: string;
  status?: string;
}

export const donationsApi = {
  list: (query: DonationQuery = {}) =>
    apiClient
      .get<{ data: Donation[]; meta: PaginatedResponse<Donation>['meta'] }>('/admin/donations', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Donation }>(`/admin/donations/${id}`).then((r) => r.data.data),

  create: (data: Partial<Donation>) =>
    apiClient.post<{ data: Donation }>('/admin/donations', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Donation>) =>
    apiClient.put<{ data: Donation }>(`/admin/donations/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/donations/${id}`),
};
