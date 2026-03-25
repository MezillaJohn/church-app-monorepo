import type { Request, Response } from 'express';
import { EventsService } from './events.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const EventsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await EventsService.findAll(req.query as never);
    return ApiResponse.paginated(res, data, meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const event = await EventsService.findById(req.params['id']!);
    return ApiResponse.success(res, event);
  }),

  live: catchAsync(async (_req: Request, res: Response) => {
    const event = await EventsService.getLatestLive();
    return ApiResponse.success(res, event);
  }),

  rsvp: catchAsync(async (req: Request, res: Response) => {
    const rsvp = await EventsService.rsvp(req.user!.id, req.params['id']!);
    return ApiResponse.created(res, rsvp, 'RSVP confirmed');
  }),

  cancelRsvp: catchAsync(async (req: Request, res: Response) => {
    await EventsService.cancelRsvp(req.user!.id, req.params['id']!);
    return ApiResponse.noContent(res);
  }),

  myRsvps: catchAsync(async (req: Request, res: Response) => {
    const events = await EventsService.myRsvps(req.user!.id);
    return ApiResponse.success(res, events);
  }),
};
