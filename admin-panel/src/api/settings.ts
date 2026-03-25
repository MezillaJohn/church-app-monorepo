import { apiClient } from './client';
import type { Setting } from '@/types';

export const settingsApi = {
  list: (group?: string) =>
    apiClient
      .get<{ data: Setting[] }>('/admin/settings', { params: group ? { group } : {} })
      .then((r) => r.data.data),

  upsert: (data: { key: string; value?: string; type?: string; group?: string; description?: string }) =>
    apiClient.put<{ data: Setting }>('/admin/settings', data).then((r) => r.data.data),

  batchUpsert: (settings: Array<{ key: string; value?: string; type?: string; group: string }>) =>
    apiClient
      .post<{ data: Setting[] }>('/admin/settings/batch', { settings })
      .then((r) => r.data.data),

  delete: (key: string) =>
    apiClient.delete(`/admin/settings/${key}`),
};
