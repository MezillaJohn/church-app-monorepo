import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IBook {
  _id: Types.ObjectId;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage?: string;
  fileUrl?: string;
  previewPages?: string;
  categoryId?: Types.ObjectId;
  subaccountId?: Types.ObjectId;
  averageRating: number;
  ratingsCount: number;
  purchasesCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    coverImage: { type: String },
    fileUrl: { type: String },
    previewPages: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    subaccountId: { type: Schema.Types.ObjectId, ref: 'Subaccount' },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    purchasesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

bookSchema.index({ isPublished: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ categoryId: 1 });
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export const Book = model<IBook>('Book', bookSchema);
