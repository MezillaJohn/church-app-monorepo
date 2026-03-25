import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type PaymentMethod = 'paystack' | 'manual';
export type DonationStatus = 'pending' | 'completed' | 'failed';

export interface IDonation {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  donationTypeId?: Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: DonationStatus;
  note?: string;
  isAnonymous: boolean;
  proofOfPayment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    donationTypeId: { type: Schema.Types.ObjectId, ref: 'DonationType' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true },
    paymentMethod: { type: String, required: true, enum: ['paystack', 'manual'] },
    transactionReference: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    note: { type: String },
    isAnonymous: { type: Boolean, default: false },
    proofOfPayment: { type: String },
  },
  baseSchemaOptions,
);

donationSchema.index({ userId: 1 });
donationSchema.index({ userId: 1, status: 1 });
donationSchema.index({ transactionReference: 1 });

export const Donation = model<IDonation>('Donation', donationSchema);
