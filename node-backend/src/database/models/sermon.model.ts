import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface ISermon {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  type: 'audio' | 'video';
  speaker?: string;
  date: Date;
  audioFileUrl?: string;
  youtubeVideoId?: string;
  youtubeVideoUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // seconds
  categoryId?: Types.ObjectId;
  seriesId?: Types.ObjectId;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sermonSchema = new Schema<ISermon>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, required: true, enum: ['audio', 'video'] },
    speaker: { type: String },
    date: { type: Date, required: true },
    audioFileUrl: { type: String },
    youtubeVideoId: { type: String },
    youtubeVideoUrl: { type: String },
    thumbnailUrl: { type: String },
    duration: { type: Number },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    seriesId: { type: Schema.Types.ObjectId, ref: 'SermonSeries' },
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

sermonSchema.index({ isPublished: 1, date: -1 });
sermonSchema.index({ isFeatured: 1 });
sermonSchema.index({ categoryId: 1 });
sermonSchema.index({ seriesId: 1 });
sermonSchema.index({ title: 'text', speaker: 'text' });

export const Sermon = model<ISermon>('Sermon', sermonSchema);
