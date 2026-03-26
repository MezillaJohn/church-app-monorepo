import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface ISupportTicket {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  adminResponse?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    adminResponse: { type: String },
    respondedAt: { type: Date },
  },
  baseSchemaOptions,
);

supportTicketSchema.index({ userId: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });

export const SupportTicket = model<ISupportTicket>('SupportTicket', supportTicketSchema);
