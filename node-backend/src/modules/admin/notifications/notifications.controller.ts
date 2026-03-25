import type { Request, Response } from 'express';
import { AdminNotificationsService } from './notifications.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminNotificationsController = {
  sendPush: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminNotificationsService.sendPush(req.body);
    ApiResponse.success(res, result, `Push notification sent to ${result.sent} device(s)`);
  }),

  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminNotificationsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),
};
