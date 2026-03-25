import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IFavorite {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sermonId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sermonId: { type: Schema.Types.ObjectId, ref: 'Sermon', required: true },
  },
  baseSchemaOptions,
);

favoriteSchema.index({ userId: 1, sermonId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1 });

export const Favorite = model<IFavorite>('Favorite', favoriteSchema);
