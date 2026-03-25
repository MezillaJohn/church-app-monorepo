import type { Request, Response } from 'express';
import { AdminCategoriesService } from './categories.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminCategoriesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminCategoriesService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const cat = await AdminCategoriesService.findById(req.params['id']!);
    ApiResponse.success(res, cat);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const cat = await AdminCategoriesService.create(req.body);
    ApiResponse.created(res, cat);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const cat = await AdminCategoriesService.update(req.params['id']!, req.body);
    ApiResponse.success(res, cat);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminCategoriesService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
