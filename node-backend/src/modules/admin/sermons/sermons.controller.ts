import type { Request, Response } from 'express';
import { AdminSermonsService } from './sermons.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminSermonsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminSermonsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const sermon = await AdminSermonsService.findById(req.params['id']!);
    ApiResponse.success(res, sermon);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const sermon = await AdminSermonsService.create(req.body);
    ApiResponse.created(res, sermon);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const sermon = await AdminSermonsService.update(req.params['id']!, req.body);
    ApiResponse.success(res, sermon);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminSermonsService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),

  togglePublish: catchAsync(async (req: Request, res: Response) => {
    const sermon = await AdminSermonsService.togglePublish(req.params['id']!);
    ApiResponse.success(res, sermon, `Sermon ${sermon.isPublished ? 'published' : 'unpublished'}`);
  }),
};
