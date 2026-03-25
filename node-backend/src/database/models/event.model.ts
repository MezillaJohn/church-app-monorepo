import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type EventType = 'service' | 'conference' | 'prayer' | 'youth' | 'children';

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  eventDate: Date;   // start datetime
  endDate: Date;     // end datetime
  location?: string;
  eventType: EventType;
  imageUrl?: string;
  maxAttendees?: number;
  requiresRsvp: boolean;
  isPublished: boolean;
  isLive: boolean;
  broadcastUrl?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    eventDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String },
    eventType: {
      type: String,
      required: true,
      enum: ['service', 'conference', 'prayer', 'youth', 'children'],
    },
    imageUrl: { type: String },
    maxAttendees: { type: Number },
    requiresRsvp: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    isLive: { type: Boolean, default: false },
    broadcastUrl: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String },
  },
  baseSchemaOptions,
);

eventSchema.index({ isPublished: 1, eventDate: 1 });
eventSchema.index({ isLive: 1 });

export const Event = model<IEvent>('Event', eventSchema);
