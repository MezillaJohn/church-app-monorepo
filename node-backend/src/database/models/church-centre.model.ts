import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IChurchCentre {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const churchCentreSchema = new Schema<IChurchCentre>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'Nigeria' },
    contactPhone: { type: String },
    contactEmail: { type: String, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

churchCentreSchema.index({ isActive: 1, name: 1 });

export const ChurchCentre = model<IChurchCentre>('ChurchCentre', churchCentreSchema);
