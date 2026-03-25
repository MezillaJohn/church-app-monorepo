import type { Request, Response } from 'express';
import { AdminPartnershipTypesService } from './partnership-types.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminPartnershipTypesController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminPartnershipTypesService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const pt = await AdminPartnershipTypesService.findById(req.params['id']!);
    ApiResponse.success(res, pt);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const pt = await AdminPartnershipTypesService.create(req.body);
    ApiResponse.created(res, pt);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const pt = await AdminPartnershipTypesService.update(req.params['id']!, req.body);
    ApiResponse.success(res, pt);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminPartnershipTypesService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
