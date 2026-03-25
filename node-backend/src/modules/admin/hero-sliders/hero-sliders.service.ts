import { HeroSlider } from '../../../database/models/hero-slider.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminHeroSliderQueryInput, CreateHeroSliderInput, UpdateHeroSliderInput } from './hero-sliders.schema';

export const AdminHeroSlidersService = {
  async findAll(query: AdminHeroSliderQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const [data, total] = await Promise.all([
      HeroSlider.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(take),
      HeroSlider.countDocuments(),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const slider = await HeroSlider.findById(id);
    if (!slider) throw new AppError('Hero slider not found', 404);
    return slider;
  },

  async create(input: CreateHeroSliderInput) {
    return HeroSlider.create(input);
  },

  async update(id: string, input: UpdateHeroSliderInput) {
    const slider = await HeroSlider.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!slider) throw new AppError('Hero slider not found', 404);
    return slider;
  },

  async delete(id: string) {
    const slider = await HeroSlider.findByIdAndDelete(id);
    if (!slider) throw new AppError('Hero slider not found', 404);
  },
};
