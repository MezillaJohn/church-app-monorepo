import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IPushToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  platform?: 'ios' | 'android';
  createdAt: Date;
  updatedAt: Date;
}

const pushTokenSchema = new Schema<IPushToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['ios', 'android'] },
  },
  baseSchemaOptions,
);

pushTokenSchema.index({ userId: 1 });

export const PushToken = model<IPushToken>('PushToken', pushTokenSchema);
