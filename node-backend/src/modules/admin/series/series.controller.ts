import type { Request, Response } from 'express';
import { AdminSeriesService } from './series.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminSeriesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminSeriesService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const series = await AdminSeriesService.findById(req.params['id']!);
    ApiResponse.success(res, series);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const series = await AdminSeriesService.create(req.body);
    ApiResponse.created(res, series);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const series = await AdminSeriesService.update(req.params['id']!, req.body);
    ApiResponse.success(res, series);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminSeriesService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
