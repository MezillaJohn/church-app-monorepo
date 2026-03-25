import type { Request, Response } from 'express';
import { SermonsService } from './sermons.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const SermonsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await SermonsService.findAll(req.query as never, req.user?.id);
    return ApiResponse.paginated(res, data, meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const sermon = await SermonsService.findById(req.params['id']!, req.user?.id);
    return ApiResponse.success(res, sermon);
  }),

  featured: catchAsync(async (req: Request, res: Response) => {
    const type = req.query['type'] as string | undefined;
    const sermons = await SermonsService.getFeatured(type, req.user?.id);
    return ApiResponse.success(res, sermons);
  }),

  toggleFavorite: catchAsync(async (req: Request, res: Response) => {
    const result = await SermonsService.toggleFavorite(req.user!.id, req.params['id']!);
    return ApiResponse.success(res, result);
  }),

  favorites: catchAsync(async (req: Request, res: Response) => {
    const sermons = await SermonsService.getFavorites(req.user!.id);
    return ApiResponse.success(res, sermons);
  }),

  toggleWatchLater: catchAsync(async (req: Request, res: Response) => {
    const result = await SermonsService.toggleWatchLater(req.user!.id, req.params['id']!);
    return ApiResponse.success(res, result);
  }),

  watchLater: catchAsync(async (req: Request, res: Response) => {
    const sermons = await SermonsService.getWatchLater(req.user!.id);
    return ApiResponse.success(res, sermons);
  }),

  updateProgress: catchAsync(async (req: Request, res: Response) => {
    const progress = await SermonsService.updateProgress(
      req.user!.id,
      req.params['id']!,
      req.body,
    );
    return ApiResponse.success(res, progress);
  }),

  getProgress: catchAsync(async (req: Request, res: Response) => {
    const progress = await SermonsService.getProgress(req.user!.id, req.params['id']!);
    return ApiResponse.success(res, progress);
  }),
};
