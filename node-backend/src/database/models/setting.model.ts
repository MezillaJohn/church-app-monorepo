import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export type SettingType = 'string' | 'integer' | 'boolean';

export interface ISetting {
  _id: Types.ObjectId;
  key: string;
  value?: string;
  type: SettingType;
  group: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String },
    type: { type: String, enum: ['string', 'integer', 'boolean'], default: 'string' },
    group: { type: String, default: 'general' },
    description: { type: String },
  },
  baseSchemaOptions,
);

settingSchema.index({ group: 1 });

export const Setting = model<ISetting>('Setting', settingSchema);
