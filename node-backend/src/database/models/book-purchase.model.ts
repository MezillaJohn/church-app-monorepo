import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface IBookPurchase {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  amount: number;
  transactionReference?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookPurchaseSchema = new Schema<IBookPurchase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    amount: { type: Number, required: true },
    transactionReference: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  baseSchemaOptions,
);

bookPurchaseSchema.index({ userId: 1 });
bookPurchaseSchema.index({ bookId: 1 });
bookPurchaseSchema.index({ transactionReference: 1 });
bookPurchaseSchema.index({ userId: 1, bookId: 1, status: 1 });

export const BookPurchase = model<IBookPurchase>('BookPurchase', bookPurchaseSchema);
