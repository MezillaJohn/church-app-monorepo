import { ServiceTime } from '../../database/models/service-time.model';

export const ServiceTimesService = {
  async findAll() {
    return ServiceTime.find({ isActive: true }).sort({ order: 1 });
  },
};
