import type { Request, Response } from 'express';
import { AdminDonationsService } from './donations.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminDonationsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminDonationsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const donation = await AdminDonationsService.findById(req.params['id']!);
    ApiResponse.success(res, donation);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const donation = await AdminDonationsService.create(req.body);
    ApiResponse.created(res, donation);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const donation = await AdminDonationsService.update(req.params['id']!, req.body);
    ApiResponse.success(res, donation);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminDonationsService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
