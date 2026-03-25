import { apiClient } from './client';
import type { DashboardStats } from '@/types';

export const dashboardApi = {
  getStats: () =>
    apiClient.get<{ data: DashboardStats }>('/admin/dashboard').then((r) => r.data.data),
};
