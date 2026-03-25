import type { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const NotificationsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const notifications = await NotificationsService.findAll(req.user!.id);
    return ApiResponse.success(res, notifications);
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const notification = await NotificationsService.markAsRead(
      req.user!.id,
      req.params['id']!,
    );
    return ApiResponse.success(res, notification, 'Notification marked as read');
  }),

  markAllAsRead: catchAsync(async (req: Request, res: Response) => {
    await NotificationsService.markAllAsRead(req.user!.id);
    return ApiResponse.success(res, null, 'All notifications marked as read');
  }),
};
