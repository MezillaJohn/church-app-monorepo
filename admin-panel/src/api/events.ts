import { apiClient } from './client';
import type { Event, PaginatedResponse } from '@/types';

export interface EventQuery {
  page?: number;
  perPage?: number;
  search?: string;
  eventType?: string;
  isPublished?: boolean;
}

export const eventsApi = {
  list: (query: EventQuery = {}) =>
    apiClient
      .get<{ data: Event[]; meta: PaginatedResponse<Event>['meta'] }>('/admin/events', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: Event }>(`/admin/events/${id}`).then((r) => r.data.data),

  create: (data: Partial<Event>) =>
    apiClient.post<{ data: Event }>('/admin/events', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Event>) =>
    apiClient.put<{ data: Event }>(`/admin/events/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/events/${id}`),
};
