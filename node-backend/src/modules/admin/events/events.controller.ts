import type { Request, Response } from 'express';
import { AdminEventsService } from './events.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminEventsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminEventsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const event = await AdminEventsService.findById(req.params['id']!);
    ApiResponse.success(res, event);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const event = await AdminEventsService.create(req.body);
    ApiResponse.created(res, event);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const event = await AdminEventsService.update(req.params['id']!, req.body);
    ApiResponse.success(res, event);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminEventsService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
