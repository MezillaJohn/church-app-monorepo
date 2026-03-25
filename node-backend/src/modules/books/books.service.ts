import { Types } from 'mongoose';
import { Book } from '../../database/models/book.model';
import { BookPurchase } from '../../database/models/book-purchase.model';
import { BookRating } from '../../database/models/book-rating.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../shared/utils/pagination';
import type { BookQueryInput, RateBookInput } from './books.schema';

const bookPopulate = [{ path: 'categoryId', select: 'name slug' }];

export const BooksService = {
  async findAll(query: BookQueryInput) {
    const { skip, take, page, perPage } = paginate(query);

    const filter: Record<string, unknown> = { isPublished: true };
    if (query.categoryId) filter['categoryId'] = query.categoryId;
    if (query.isFeatured !== undefined) filter['isFeatured'] = query.isFeatured;
    if (query.author) filter['author'] = { $regex: query.author, $options: 'i' };
    if (query.search) filter['$text'] = { $search: query.search };

    const [data, total] = await Promise.all([
      Book.find(filter).populate(bookPopulate).sort({ createdAt: -1 }).skip(skip).limit(take),
      Book.countDocuments(filter),
    ]);

    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const book = await Book.findOne({ _id: id, isPublished: true }).populate(bookPopulate);
    if (!book) throw new AppError('Book not found', 404);
    return book;
  },

  async featured() {
    return Book.find({ isFeatured: true, isPublished: true })
      .populate(bookPopulate)
      .sort({ createdAt: -1 })
      .limit(10);
  },

  async myBooks(userId: string) {
    const purchases = await BookPurchase.find({ userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .populate({ path: 'bookId', populate: bookPopulate });

    return purchases.map((p) => p.bookId).filter(Boolean);
  },

  async checkPurchase(userId: string, bookId: string) {
    const purchase = await BookPurchase.findOne({ userId, bookId, status: 'completed' });
    return { purchased: purchase !== null };
  },

  async rateBook(userId: string, bookId: string, input: RateBookInput) {
    const book = await Book.findOne({ _id: bookId, isPublished: true });
    if (!book) throw new AppError('Book not found', 404);

    await BookRating.findOneAndUpdate(
      { userId, bookId },
      { $set: { rating: input.rating, ...(input.review !== undefined && { review: input.review }) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // Recalculate average rating and count
    const [aggregate] = await BookRating.aggregate([
      { $match: { bookId: new Types.ObjectId(bookId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Book.updateOne(
      { _id: bookId },
      { averageRating: aggregate?.avgRating ?? 0, ratingsCount: aggregate?.count ?? 0 },
    );

    return { rated: true };
  },
};
