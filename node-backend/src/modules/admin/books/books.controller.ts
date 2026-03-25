import type { Request, Response } from 'express';
import { AdminBooksService } from './books.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminBooksController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminBooksService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const book = await AdminBooksService.findById(req.params['id']!);
    ApiResponse.success(res, book);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const book = await AdminBooksService.create(req.body);
    ApiResponse.created(res, book);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const book = await AdminBooksService.update(req.params['id']!, req.body);
    ApiResponse.success(res, book);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminBooksService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),

  togglePublish: catchAsync(async (req: Request, res: Response) => {
    const book = await AdminBooksService.togglePublish(req.params['id']!);
    ApiResponse.success(res, book, `Book ${book.isPublished ? 'published' : 'unpublished'}`);
  }),
};
