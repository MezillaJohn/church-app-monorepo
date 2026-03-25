import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IPartnershipType {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const partnershipTypeSchema = new Schema<IPartnershipType>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

export const PartnershipType = model<IPartnershipType>('PartnershipType', partnershipTypeSchema);
