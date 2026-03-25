import { apiClient } from './client';
import type { UploadResult } from '@/types';

export const uploadsApi = {
  upload: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<{ data: UploadResult }>('/admin/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: folder ? { folder } : {},
      })
      .then((r) => r.data.data);
  },

  delete: (publicId: string, resourceType?: 'image' | 'video' | 'raw') =>
    apiClient.delete('/admin/uploads', { data: { publicId, resourceType } }),
};
