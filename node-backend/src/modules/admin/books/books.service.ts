import { Book } from '../../../database/models/book.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminBookQueryInput, CreateBookInput, UpdateBookInput } from './books.schema';

const populate = [{ path: 'categoryId', select: 'name slug' }];

export const AdminBooksService = {
  async findAll(query: AdminBookQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};
    if (query.search) filter['$or'] = [
      { title: { $regex: query.search, $options: 'i' } },
      { author: { $regex: query.search, $options: 'i' } },
    ];
    if (query.categoryId) filter['categoryId'] = query.categoryId;
    if (query.isPublished !== undefined) filter['isPublished'] = query.isPublished;

    const [data, total] = await Promise.all([
      Book.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(take),
      Book.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const book = await Book.findById(id).populate(populate);
    if (!book) throw new AppError('Book not found', 404);
    return book;
  },

  async create(input: CreateBookInput) {
    return Book.create(input);
  },

  async update(id: string, input: UpdateBookInput) {
    const book = await Book.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).populate(populate);
    if (!book) throw new AppError('Book not found', 404);
    return book;
  },

  async delete(id: string) {
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new AppError('Book not found', 404);
  },

  async togglePublish(id: string) {
    const book = await Book.findById(id);
    if (!book) throw new AppError('Book not found', 404);
    book.isPublished = !book.isPublished;
    await book.save();
    return book;
  },
};
