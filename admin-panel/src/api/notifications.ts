import { apiClient } from './client';
import type { Notification, PaginatedResponse } from '@/types';

export interface SendPushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  targetType: 'all' | 'user';
  userId?: string;
}

export const notificationsApi = {
  sendPush: (payload: SendPushPayload) =>
    apiClient
      .post<{ data: { sent: number } }>('/admin/notifications/push', payload)
      .then((r) => r.data.data),

  list: (query: { page?: number; perPage?: number; userId?: string; type?: string } = {}) =>
    apiClient
      .get<{ data: Notification[]; meta: PaginatedResponse<Notification>['meta'] }>('/admin/notifications', { params: query })
      .then((r) => r.data),
};
