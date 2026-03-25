import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

export interface IBookRating {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number; // 1–5
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookRatingSchema = new Schema<IBookRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
  },
  baseSchemaOptions,
);

bookRatingSchema.index({ userId: 1, bookId: 1 }, { unique: true });
bookRatingSchema.index({ bookId: 1 });

export const BookRating = model<IBookRating>('BookRating', bookRatingSchema);
