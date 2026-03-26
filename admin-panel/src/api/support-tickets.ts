import { apiClient } from './client';
import type { SupportTicket, PaginatedResponse } from '@/types';

export interface TicketQuery {
  page?: number;
  perPage?: number;
  search?: string;
  status?: 'open' | 'in-progress' | 'resolved';
}

export interface RespondPayload {
  adminResponse: string;
  status?: 'open' | 'in-progress' | 'resolved';
}

export const supportTicketsApi = {
  list: (query: TicketQuery = {}) =>
    apiClient
      .get<{ data: SupportTicket[]; meta: PaginatedResponse<SupportTicket>['meta'] }>(
        '/admin/support-tickets',
        { params: query },
      )
      .then((r) => r.data),

  get: (id: string) =>
    apiClient
      .get<{ data: SupportTicket }>(`/admin/support-tickets/${id}`)
      .then((r) => r.data.data),

  respond: (id: string, data: RespondPayload) =>
    apiClient
      .post<{ data: SupportTicket }>(`/admin/support-tickets/${id}/respond`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/support-tickets/${id}`),
};
