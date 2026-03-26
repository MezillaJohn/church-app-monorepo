import { ServiceTime } from '../../../database/models/service-time.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminServiceTimeQueryInput, CreateServiceTimeInput, UpdateServiceTimeInput } from './service-times.schema';

export const AdminServiceTimesService = {
  async findAll(query: AdminServiceTimeQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const [data, total] = await Promise.all([
      ServiceTime.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(take),
      ServiceTime.countDocuments(),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const item = await ServiceTime.findById(id);
    if (!item) throw new AppError('Service time not found', 404);
    return item;
  },

  async create(input: CreateServiceTimeInput) {
    return ServiceTime.create(input);
  },

  async update(id: string, input: UpdateServiceTimeInput) {
    const item = await ServiceTime.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!item) throw new AppError('Service time not found', 404);
    return item;
  },

  async delete(id: string) {
    const item = await ServiceTime.findByIdAndDelete(id);
    if (!item) throw new AppError('Service time not found', 404);
  },
};
