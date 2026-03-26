import type { Request, Response } from 'express';
import { SupportTicketsService } from './support-tickets.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const SupportTicketsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const ticket = await SupportTicketsService.create(req.user!.id, req.body);
    return ApiResponse.created(res, ticket, 'Support ticket submitted successfully');
  }),

  myTickets: catchAsync(async (req: Request, res: Response) => {
    const tickets = await SupportTicketsService.findByUser(req.user!.id);
    return ApiResponse.success(res, tickets);
  }),
};
