import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IEventRsvp {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventRsvpSchema = new Schema<IEventRsvp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  baseSchemaOptions,
);

eventRsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });
eventRsvpSchema.index({ userId: 1 });

export const EventRsvp = model<IEventRsvp>('EventRsvp', eventRsvpSchema);
