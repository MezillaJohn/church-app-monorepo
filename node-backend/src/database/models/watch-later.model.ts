import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IWatchLater {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sermonId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const watchLaterSchema = new Schema<IWatchLater>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sermonId: { type: Schema.Types.ObjectId, ref: 'Sermon', required: true },
  },
  baseSchemaOptions,
);

watchLaterSchema.index({ userId: 1, sermonId: 1 }, { unique: true });
watchLaterSchema.index({ userId: 1 });

export const WatchLater = model<IWatchLater>('WatchLater', watchLaterSchema);
