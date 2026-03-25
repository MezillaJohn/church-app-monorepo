import type { Request, Response } from 'express';
import { AdminBankAccountsService } from './bank-accounts.service';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';

export const AdminBankAccountsController = {
  index: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminBankAccountsService.findAll(req.query as never);
    ApiResponse.paginated(res, result.data, result.meta);
  }),

  show: catchAsync(async (req: Request, res: Response) => {
    const account = await AdminBankAccountsService.findById(req.params['id']!);
    ApiResponse.success(res, account);
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const account = await AdminBankAccountsService.create(req.body);
    ApiResponse.created(res, account);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const account = await AdminBankAccountsService.update(req.params['id']!, req.body);
    ApiResponse.success(res, account);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await AdminBankAccountsService.delete(req.params['id']!);
    ApiResponse.noContent(res);
  }),
};
