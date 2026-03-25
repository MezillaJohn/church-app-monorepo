import { Category } from '../../database/models/category.model';
import type { CategoryQueryInput } from './categories.schema';

export const CategoriesService = {
  async getCategories(query: CategoryQueryInput) {
    const filter: Record<string, unknown> = { isActive: true };
    if (query.type) filter['type'] = query.type;
    return Category.find(filter).sort({ name: 1 });
  },
};
