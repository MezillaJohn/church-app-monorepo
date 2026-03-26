import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type NotificationType = 'sermon' | 'book' | 'event' | 'announcement';

export interface INotification {
  _id: Types.ObjectId;
  type: NotificationType;
  userId: Types.ObjectId;
  title: string;
  body: string;
  resourceId?: string;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      required: true,
      enum: ['sermon', 'book', 'event', 'announcement'],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    resourceId: { type: String, default: null },
    readAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, readAt: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);
