import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface ISermonProgress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sermonId: Types.ObjectId;
  progressSeconds: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sermonProgressSchema = new Schema<ISermonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sermonId: { type: Schema.Types.ObjectId, ref: 'Sermon', required: true },
    progressSeconds: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

sermonProgressSchema.index({ userId: 1, sermonId: 1 }, { unique: true });

export const SermonProgress = model<ISermonProgress>('SermonProgress', sermonProgressSchema);
