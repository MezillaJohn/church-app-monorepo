import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type PartnershipInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface IPartnership {
  _id: Types.ObjectId;
  fullname: string;
  phoneNo: string;
  email: string;
  partnershipTypeId: Types.ObjectId;
  interval: PartnershipInterval;
  amount: number;
  currency: string;
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const partnershipSchema = new Schema<IPartnership>(
  {
    fullname: { type: String, required: true, trim: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    partnershipTypeId: { type: Schema.Types.ObjectId, ref: 'PartnershipType', required: true },
    interval: {
      type: String,
      required: true,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  baseSchemaOptions,
);

partnershipSchema.index({ userId: 1 });
partnershipSchema.index({ partnershipTypeId: 1 });

export const Partnership = model<IPartnership>('Partnership', partnershipSchema);
