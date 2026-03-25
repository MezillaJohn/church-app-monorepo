import type { Request, Response } from 'express';
import { PartnershipsService } from './partnerships.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const PartnershipsController = {
  types: catchAsync(async (_req: Request, res: Response) => {
    const types = await PartnershipsService.getTypes();
    return ApiResponse.success(res, types);
  }),

  store: catchAsync(async (req: Request, res: Response) => {
    const partnership = await PartnershipsService.store(req.user!.id, req.body);
    return ApiResponse.created(res, partnership, 'Partnership created successfully');
  }),
};
