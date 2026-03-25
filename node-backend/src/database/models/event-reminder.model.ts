import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IEventReminder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  remindAt: Date;
  sent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventReminderSchema = new Schema<IEventReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    remindAt: { type: Date, required: true },
    sent: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

eventReminderSchema.index({ userId: 1, eventId: 1 });
eventReminderSchema.index({ remindAt: 1, sent: 1 });

export const EventReminder = model<IEventReminder>('EventReminder', eventReminderSchema);
