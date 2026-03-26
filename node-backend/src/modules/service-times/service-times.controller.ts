import type { Request, Response } from 'express';
import { ServiceTimesService } from './service-times.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const ServiceTimesController = {
  index: catchAsync(async (_req: Request, res: Response) => {
    const data = await ServiceTimesService.findAll();
    ApiResponse.success(res, data, 'Service times retrieved successfully');
  }),
};
