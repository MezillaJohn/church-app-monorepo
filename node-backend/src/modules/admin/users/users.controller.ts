import type { Request, Response } from 'express';
import { AdminUsersService } from './users.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminUsersController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminUsersService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const user = await AdminUsersService.findById(req.params['id']!);
    ApiResponse.success(res, user);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const user = await AdminUsersService.create(req.body);
    ApiResponse.created(res, user);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const user = await AdminUsersService.update(req.params['id']!, req.body);
    ApiResponse.success(res, user);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminUsersService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),

  toggleAdmin: catchAsync(async (req: Request, res: Response) => {
    const user = await AdminUsersService.toggleAdmin(req.params['id']!);
    ApiResponse.success(res, user, `User is now ${user.isAdmin ? 'an admin' : 'a regular user'}`);
  }),
};
