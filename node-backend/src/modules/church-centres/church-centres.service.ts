import { ChurchCentre } from '../../database/models/church-centre.model';

export const ChurchCentresService = {
  async findAll() {
    return ChurchCentre.find({ isActive: true }).sort({ name: 1 });
  },
};
