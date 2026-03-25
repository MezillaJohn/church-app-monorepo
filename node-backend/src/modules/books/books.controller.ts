import type { Request, Response } from 'express';
import { BooksService } from './books.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const BooksController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await BooksService.findAll(req.query as never);
    return ApiResponse.paginated(res, data, meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const book = await BooksService.findById(req.params['id']!);
    return ApiResponse.success(res, book);
  }),

  featured: catchAsync(async (_req: Request, res: Response) => {
    const books = await BooksService.featured();
    return ApiResponse.success(res, books);
  }),

  myBooks: catchAsync(async (req: Request, res: Response) => {
    const books = await BooksService.myBooks(req.user!.id);
    return ApiResponse.success(res, books);
  }),

  checkPurchase: catchAsync(async (req: Request, res: Response) => {
    const result = await BooksService.checkPurchase(req.user!.id, req.params['id']!);
    return ApiResponse.success(res, result);
  }),

  rateBook: catchAsync(async (req: Request, res: Response) => {
    const result = await BooksService.rateBook(req.user!.id, req.params['id']!, req.body);
    return ApiResponse.success(res, result, 'Book rated successfully');
  }),
};
