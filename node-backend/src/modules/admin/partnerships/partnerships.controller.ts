import type { Request, Response } from 'express';
import { AdminPartnershipsService } from './partnerships.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminPartnershipsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminPartnershipsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const partnership = await AdminPartnershipsService.findById(req.params['id']!);
    ApiResponse.success(res, partnership);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const partnership = await AdminPartnershipsService.create(req.body);
    ApiResponse.created(res, partnership);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const partnership = await AdminPartnershipsService.update(req.params['id']!, req.body);
    ApiResponse.success(res, partnership);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminPartnershipsService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
