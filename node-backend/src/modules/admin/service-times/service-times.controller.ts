import type { Request, Response } from 'express';
import { AdminServiceTimesService } from './service-times.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminServiceTimesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServiceTimesService.findAll(req.query as any);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const data = await AdminServiceTimesService.findById(req.params['id']!);
    ApiResponse.success(res, data);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const data = await AdminServiceTimesService.create(req.body);
    ApiResponse.created(res, data, 'Service time created successfully');
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const data = await AdminServiceTimesService.update(req.params['id']!, req.body);
    ApiResponse.success(res, data, 'Service time updated successfully');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminServiceTimesService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
