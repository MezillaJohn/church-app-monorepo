import type { Request, Response } from 'express';
import { ChurchCentresService } from './church-centres.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const ChurchCentresController = {
  index: catchAsync(async (_req: Request, res: Response) => {
    const centres = await ChurchCentresService.findAll();
    return ApiResponse.success(res, centres);
  }),
};
