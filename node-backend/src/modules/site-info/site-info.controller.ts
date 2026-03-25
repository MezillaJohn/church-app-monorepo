import type { Request, Response } from 'express';
import { SiteInfoService } from './site-info.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const SiteInfoController = {
  index: catchAsync(async (_req: Request, res: Response) => {
    const info = await SiteInfoService.getInfo();
    return ApiResponse.success(res, info);
  }),
};
