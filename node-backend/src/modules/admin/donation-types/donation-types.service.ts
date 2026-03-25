import { DonationType } from '../../../database/models/donation-type.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminDonationTypeQueryInput, CreateDonationTypeInput, UpdateDonationTypeInput } from './donation-types.schema';

export const AdminDonationTypesService = {
  async findAll(query: AdminDonationTypeQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['name'] = { $regex: query.search, $options: 'i' };

    const [data, total] = await Promise.all([
      DonationType.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take),
      DonationType.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const dt = await DonationType.findById(id);
    if (!dt) throw new AppError('Donation type not found', 404);
    return dt;
  },

  async create(input: CreateDonationTypeInput) {
    return DonationType.create(input);
  },

  async update(id: string, input: UpdateDonationTypeInput) {
    const dt = await DonationType.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!dt) throw new AppError('Donation type not found', 404);
    return dt;
  },

  async delete(id: string) {
    const dt = await DonationType.findByIdAndDelete(id);
    if (!dt) throw new AppError('Donation type not found', 404);
  },
};
