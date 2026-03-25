import { HeroSlider } from '../../database/models/hero-slider.model';

export const HeroSlidersService = {
  async findAll() {
    return HeroSlider.find({ isActive: true }).sort({ order: 1 });
  },
};
