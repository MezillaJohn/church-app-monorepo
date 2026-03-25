import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IBankAccount {
  _id: Types.ObjectId;
  title?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bankAccountSchema = new Schema<IBankAccount>(
  {
    title: { type: String },
    bankName: { type: String, required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    sortCode: { type: String },
    currency: { type: String, default: 'NGN', uppercase: true },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

bankAccountSchema.index({ isActive: 1 });

export const BankAccount = model<IBankAccount>('BankAccount', bankAccountSchema);
