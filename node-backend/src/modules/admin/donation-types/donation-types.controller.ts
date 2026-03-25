import type { Request, Response } from 'express';
import { AdminDonationTypesService } from './donation-types.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminDonationTypesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminDonationTypesService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const dt = await AdminDonationTypesService.findById(req.params['id']!);
    ApiResponse.success(res, dt);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const dt = await AdminDonationTypesService.create(req.body);
    ApiResponse.created(res, dt);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const dt = await AdminDonationTypesService.update(req.params['id']!, req.body);
    ApiResponse.success(res, dt);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminDonationTypesService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
