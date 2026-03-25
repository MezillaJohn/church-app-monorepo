import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IHeroSlider {
  _id: Types.ObjectId;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroSliderSchema = new Schema<IHeroSlider>(
  {
    title: { type: String },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

heroSliderSchema.index({ isActive: 1, order: 1 });

export const HeroSlider = model<IHeroSlider>('HeroSlider', heroSliderSchema);
