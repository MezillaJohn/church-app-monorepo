import { ChurchCentre } from '../../../database/models/church-centre.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminChurchCentreQueryInput, CreateChurchCentreInput, UpdateChurchCentreInput } from './church-centres.schema';

export const AdminChurchCentresService = {
  async findAll(query: AdminChurchCentreQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['name'] = { $regex: query.search, $options: 'i' };

    const [data, total] = await Promise.all([
      ChurchCentre.find(filter).sort({ name: 1 }).skip(skip).limit(take),
      ChurchCentre.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const centre = await ChurchCentre.findById(id);
    if (!centre) throw new AppError('Church centre not found', 404);
    return centre;
  },

  async create(input: CreateChurchCentreInput) {
    return ChurchCentre.create(input);
  },

  async update(id: string, input: UpdateChurchCentreInput) {
    const centre = await ChurchCentre.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!centre) throw new AppError('Church centre not found', 404);
    return centre;
  },

  async delete(id: string) {
    const centre = await ChurchCentre.findByIdAndDelete(id);
    if (!centre) throw new AppError('Church centre not found', 404);
  },
};
