import type { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const DashboardController = {
  getStats: catchAsync(async (_req: Request, res: Response) => {
    const stats = await DashboardService.getStats();
    ApiResponse.success(res, stats, 'Dashboard stats');
  }),
};
