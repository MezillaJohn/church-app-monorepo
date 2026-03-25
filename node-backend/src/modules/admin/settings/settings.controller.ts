import type { Request, Response } from 'express';
import { AdminSettingsService } from './settings.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminSettingsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const { group } = req.query as { group?: string };
    const settings = await AdminSettingsService.findAll(group);
    ApiResponse.success(res, settings);
  }),

  upsert: catchAsync(async (req: Request, res: Response) => {
    const setting = await AdminSettingsService.upsert(req.body);
    ApiResponse.success(res, setting);
  }),

  batchUpsert: catchAsync(async (req: Request, res: Response) => {
    const settings = await AdminSettingsService.batchUpsert(req.body);
    ApiResponse.success(res, settings, 'Settings saved');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminSettingsService.delete(req.params['key']!);
    ApiResponse.noContent(res);
  }),
};
