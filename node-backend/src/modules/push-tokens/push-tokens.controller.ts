import type { Request, Response } from 'express';
import { PushTokensService } from './push-tokens.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const PushTokensController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const tokens = await PushTokensService.findAll(req.user!.id);
    return ApiResponse.success(res, tokens);
  }),

  store: catchAsync(async (req: Request, res: Response) => {
    const token = await PushTokensService.upsert(req.user!.id, req.body);
    return ApiResponse.created(res, token, 'Push token registered');
  }),

  destroy: catchAsync(async (req: Request, res: Response) => {
    await PushTokensService.destroy(req.user!.id, req.params['id']!);
    return ApiResponse.noContent(res);
  }),
};
