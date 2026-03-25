import { apiClient } from './client';
import type { BankAccount, PaginatedResponse } from '@/types';

export const bankAccountsApi = {
  list: (query: { page?: number; perPage?: number } = {}) =>
    apiClient
      .get<{ data: BankAccount[]; meta: PaginatedResponse<BankAccount>['meta'] }>('/admin/bank-accounts', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: BankAccount }>(`/admin/bank-accounts/${id}`).then((r) => r.data.data),

  create: (data: Partial<BankAccount>) =>
    apiClient.post<{ data: BankAccount }>('/admin/bank-accounts', data).then((r) => r.data.data),

  update: (id: string, data: Partial<BankAccount>) =>
    apiClient.put<{ data: BankAccount }>(`/admin/bank-accounts/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/bank-accounts/${id}`),
};
