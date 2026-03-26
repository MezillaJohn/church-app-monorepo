import type { Request, Response } from 'express';
import { AdminSupportTicketsService } from './support-tickets.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminSupportTicketsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminSupportTicketsService.findAll(req.query as any);
    return ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const ticket = await AdminSupportTicketsService.findById(req.params['id']!);
    return ApiResponse.success(res, ticket);
  }),

  respond: catchAsync(async (req: Request, res: Response) => {
    const ticket = await AdminSupportTicketsService.respond(req.params['id']!, req.body);
    return ApiResponse.success(res, ticket, 'Response sent to user via email');
  }),

  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const ticket = await AdminSupportTicketsService.updateStatus(req.params['id']!, req.body.status);
    return ApiResponse.success(res, ticket);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminSupportTicketsService.delete(req.params['id']!);
    return ApiResponse.noContent(res);
  }),
};
