import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IServiceTime {
  _id: Types.ObjectId;
  day: string;
  time: string;
  label: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceTimeSchema = new Schema<IServiceTime>(
  {
    day: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

serviceTimeSchema.index({ isActive: 1, order: 1 });

export const ServiceTime = model<IServiceTime>('ServiceTime', serviceTimeSchema);
