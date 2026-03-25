import type { Request, Response } from 'express';
import { CategoriesService } from './categories.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';
import type { CategoryQueryInput } from './categories.schema';

export const CategoriesController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoriesService.getCategories(req.query as CategoryQueryInput);
    return ApiResponse.success(res, categories);
  }),
};
