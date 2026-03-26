import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IDeviceInfo {
  brand?: string | null;
  manufacturer?: string | null;
  modelName?: string | null;
  osName?: string | null;
  osVersion?: string | null;
}

export interface IPushToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  platform?: 'ios' | 'android';
  deviceInfo?: IDeviceInfo;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pushTokenSchema = new Schema<IPushToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['ios', 'android'] },
    deviceInfo: {
      brand: String,
      manufacturer: String,
      modelName: String,
      osName: String,
      osVersion: String,
    },
    lastUsedAt: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

pushTokenSchema.index({ userId: 1 });
pushTokenSchema.index({ lastUsedAt: 1 });

export const PushToken = model<IPushToken>('PushToken', pushTokenSchema);
