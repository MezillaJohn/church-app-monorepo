import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface INotification {
  _id: Types.ObjectId;
  type: string;
  userId: Types.ObjectId;
  data: Record<string, unknown>;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
    readAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, readAt: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);
