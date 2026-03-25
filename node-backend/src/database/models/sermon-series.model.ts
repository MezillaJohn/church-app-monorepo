import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface ISermonSeries {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  slug: string;
  preacher?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sermonSeriesSchema = new Schema<ISermonSeries>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    preacher: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

sermonSeriesSchema.index({ isActive: 1 });

export const SermonSeries = model<ISermonSeries>('SermonSeries', sermonSeriesSchema);
