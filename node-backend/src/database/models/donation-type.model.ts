import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IDonationType {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  subaccountId?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const donationTypeSchema = new Schema<IDonationType>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    subaccountId: { type: Schema.Types.ObjectId, ref: 'Subaccount' },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

donationTypeSchema.index({ isActive: 1 });

export const DonationType = model<IDonationType>('DonationType', donationTypeSchema);
