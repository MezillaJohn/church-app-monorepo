import { PartnershipType } from '../../../database/models/partnership-type.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminPartnershipTypeQueryInput, CreatePartnershipTypeInput, UpdatePartnershipTypeInput } from './partnership-types.schema';

export const AdminPartnershipTypesService = {
  async findAll(query: AdminPartnershipTypeQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['name'] = { $regex: query.search, $options: 'i' };

    const [data, total] = await Promise.all([
      PartnershipType.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take),
      PartnershipType.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const pt = await PartnershipType.findById(id);
    if (!pt) throw new AppError('Partnership type not found', 404);
    return pt;
  },

  async create(input: CreatePartnershipTypeInput) {
    return PartnershipType.create(input);
  },

  async update(id: string, input: UpdatePartnershipTypeInput) {
    const pt = await PartnershipType.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!pt) throw new AppError('Partnership type not found', 404);
    return pt;
  },

  async delete(id: string) {
    const pt = await PartnershipType.findByIdAndDelete(id);
    if (!pt) throw new AppError('Partnership type not found', 404);
  },
};
