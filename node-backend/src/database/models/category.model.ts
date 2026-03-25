import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  type: 'sermon' | 'book' | 'giving';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, required: true, enum: ['sermon', 'book', 'giving'] },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

categorySchema.index({ type: 1, isActive: 1 });

export const Category = model<ICategory>('Category', categorySchema);
