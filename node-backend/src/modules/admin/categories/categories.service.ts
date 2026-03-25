import { Category } from '../../../database/models/category.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminCategoryQueryInput, CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

export const AdminCategoriesService = {
  async findAll(query: AdminCategoryQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['name'] = { $regex: query.search, $options: 'i' };
    if (query.type) filter['type'] = query.type;

    const [data, total] = await Promise.all([
      Category.find(filter).sort({ name: 1 }).skip(skip).limit(take),
      Category.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const cat = await Category.findById(id);
    if (!cat) throw new AppError('Category not found', 404);
    return cat;
  },

  async create(input: CreateCategoryInput) {
    return Category.create(input);
  },

  async update(id: string, input: UpdateCategoryInput) {
    const cat = await Category.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!cat) throw new AppError('Category not found', 404);
    return cat;
  },

  async delete(id: string) {
    const cat = await Category.findByIdAndDelete(id);
    if (!cat) throw new AppError('Category not found', 404);
  },
};
