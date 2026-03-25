import { Partnership } from '../../../database/models/partnership.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminPartnershipQueryInput, CreatePartnershipInput, UpdatePartnershipInput } from './partnerships.schema';

const populate = [
  { path: 'partnershipTypeId', select: 'name' },
  { path: 'userId', select: 'name email' },
];

export const AdminPartnershipsService = {
  async findAll(query: AdminPartnershipQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter['$or'] = [
        { fullname: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phoneNo: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.partnershipTypeId) filter['partnershipTypeId'] = query.partnershipTypeId;
    if (query.interval) filter['interval'] = query.interval;
    if (query.userId) filter['userId'] = query.userId;

    const [data, total] = await Promise.all([
      Partnership.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(take),
      Partnership.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const partnership = await Partnership.findById(id).populate(populate);
    if (!partnership) throw new AppError('Partnership not found', 404);
    return partnership;
  },

  async create(input: CreatePartnershipInput) {
    return Partnership.create(input);
  },

  async update(id: string, input: UpdatePartnershipInput) {
    const partnership = await Partnership.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).populate(populate);
    if (!partnership) throw new AppError('Partnership not found', 404);
    return partnership;
  },

  async delete(id: string) {
    const partnership = await Partnership.findByIdAndDelete(id);
    if (!partnership) throw new AppError('Partnership not found', 404);
  },
};
