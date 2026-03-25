import type { Request, Response } from 'express';
import { HeroSlidersService } from './hero-sliders.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const HeroSlidersController = {
  index: catchAsync(async (_req: Request, res: Response) => {
    const sliders = await HeroSlidersService.findAll();
    return ApiResponse.success(res, sliders);
  }),
};
