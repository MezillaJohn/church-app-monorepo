import { apiClient } from './client';
import type { HeroSlider, PaginatedResponse } from '@/types';

export const heroSlidersApi = {
  list: (query: { page?: number; perPage?: number } = {}) =>
    apiClient
      .get<{ data: HeroSlider[]; meta: PaginatedResponse<HeroSlider>['meta'] }>('/admin/hero-sliders', { params: query })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ data: HeroSlider }>(`/admin/hero-sliders/${id}`).then((r) => r.data.data),

  create: (data: Partial<HeroSlider>) =>
    apiClient.post<{ data: HeroSlider }>('/admin/hero-sliders', data).then((r) => r.data.data),

  update: (id: string, data: Partial<HeroSlider>) =>
    apiClient.put<{ data: HeroSlider }>(`/admin/hero-sliders/${id}`, data).then((r) => r.data.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/hero-sliders/${id}`),
};
