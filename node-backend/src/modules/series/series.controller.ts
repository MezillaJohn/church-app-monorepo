import type { Request, Response } from 'express';
import { SeriesService } from './series.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const SeriesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await SeriesService.findAll(req.query as never);
    return ApiResponse.paginated(res, data, meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const series = await SeriesService.findById(req.params['id']!);
    return ApiResponse.success(res, series);
  }),
};
