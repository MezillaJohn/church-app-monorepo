import type { Request, Response } from 'express';
import { DonationsService } from './donations.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const DonationsController = {
  types: catchAsync(async (_req: Request, res: Response) => {
    const types = await DonationsService.getDonationTypes();
    return ApiResponse.success(res, types);
  }),

  donate: catchAsync(async (req: Request, res: Response) => {
    const donation = await DonationsService.donate(req.user!.id, req.body);
    return ApiResponse.created(res, donation, 'Donation recorded successfully');
  }),

  history: catchAsync(async (req: Request, res: Response) => {
    const donations = await DonationsService.getHistory(req.user!.id);
    return ApiResponse.success(res, donations);
  }),

  total: catchAsync(async (req: Request, res: Response) => {
    const result = await DonationsService.getTotalDonations(req.user!.id);
    return ApiResponse.success(res, result);
  }),
};
