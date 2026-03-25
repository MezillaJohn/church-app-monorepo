import type { Request, Response } from 'express';
import { AdminHeroSlidersService } from './hero-sliders.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminHeroSlidersController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminHeroSlidersService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const slider = await AdminHeroSlidersService.findById(req.params['id']!);
    ApiResponse.success(res, slider);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const slider = await AdminHeroSlidersService.create(req.body);
    ApiResponse.created(res, slider);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const slider = await AdminHeroSlidersService.update(req.params['id']!, req.body);
    ApiResponse.success(res, slider);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminHeroSlidersService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
