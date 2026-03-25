import { PartnershipType } from '../../database/models/partnership-type.model';
import { Partnership } from '../../database/models/partnership.model';
import type { CreatePartnershipInput } from './partnerships.schema';

export const PartnershipsService = {
  async getTypes() {
    return PartnershipType.find({ isActive: true }).sort({ name: 1 });
  },

  async store(userId: string, input: CreatePartnershipInput) {
    return Partnership.create({
      userId,
      fullname: input.fullname,
      phoneNo: input.phoneNo,
      email: input.email,
      partnershipTypeId: input.partnershipTypeId,
      interval: input.interval,
      amount: input.amount,
      currency: input.currency,
    });
  },
};
