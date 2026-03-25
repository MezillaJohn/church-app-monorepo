import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type SubaccountCreationMethod = 'automatic' | 'manual';

export interface ISubaccount {
  _id: Types.ObjectId;
  creationMethod: SubaccountCreationMethod;
  businessName: string;
  paystackSubaccountCode: string;
  settlementBank?: string;
  accountNumber?: string;
  percentageCharge?: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subaccountSchema = new Schema<ISubaccount>(
  {
    creationMethod: { type: String, enum: ['automatic', 'manual'], default: 'manual' },
    businessName: { type: String, required: true, trim: true },
    paystackSubaccountCode: { type: String, required: true, unique: true },
    settlementBank: { type: String },
    accountNumber: { type: String },
    percentageCharge: { type: Number, min: 0, max: 100 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  baseSchemaOptions,
);

export const Subaccount = model<ISubaccount>('Subaccount', subaccountSchema);
