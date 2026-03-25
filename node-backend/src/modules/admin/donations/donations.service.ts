import { Donation } from '../../../database/models/donation.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminDonationQueryInput, CreateDonationInput, UpdateDonationInput } from './donations.schema';

const populate = [
  { path: 'userId', select: 'name email' },
  { path: 'donationTypeId', select: 'name' },
];

export const AdminDonationsService = {
  async findAll(query: AdminDonationQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter['$or'] = [{ transactionReference: { $regex: query.search, $options: 'i' } }];
    }
    if (query.userId) filter['userId'] = query.userId;
    if (query.donationTypeId) filter['donationTypeId'] = query.donationTypeId;
    if (query.paymentMethod) filter['paymentMethod'] = query.paymentMethod;
    if (query.status) filter['status'] = query.status;

    const [data, total] = await Promise.all([
      Donation.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(take),
      Donation.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const donation = await Donation.findById(id).populate(populate);
    if (!donation) throw new AppError('Donation not found', 404);
    return donation;
  },

  async create(input: CreateDonationInput) {
    return Donation.create(input);
  },

  async update(id: string, input: UpdateDonationInput) {
    const donation = await Donation.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).populate(populate);
    if (!donation) throw new AppError('Donation not found', 404);
    return donation;
  },

  async delete(id: string) {
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) throw new AppError('Donation not found', 404);
  },
};
