import type { Request, Response } from 'express';
import { AdminChurchCentresService } from './church-centres.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminChurchCentresController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminChurchCentresService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const centre = await AdminChurchCentresService.findById(req.params['id']!);
    ApiResponse.success(res, centre);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const centre = await AdminChurchCentresService.create(req.body);
    ApiResponse.created(res, centre);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const centre = await AdminChurchCentresService.update(req.params['id']!, req.body);
    ApiResponse.success(res, centre);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminChurchCentresService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
