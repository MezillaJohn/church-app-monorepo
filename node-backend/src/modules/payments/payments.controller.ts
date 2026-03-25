import type { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const PaymentsController = {
  purchaseBook: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentsService.purchaseBook(req.user!.id, req.params['id']!);
    return ApiResponse.created(res, result, 'Purchase initiated');
  }),

  verifyPayment: catchAsync(async (req: Request, res: Response) => {
    const purchase = await PaymentsService.verifyPayment(req.body.reference);
    return ApiResponse.success(res, purchase, 'Payment verified');
  }),

  handleWebhook: catchAsync(async (req: Request, res: Response) => {
    const signature = (req.headers['x-paystack-signature'] as string) ?? '';
    const result = await PaymentsService.handleWebhook(req.body, signature);
    return ApiResponse.success(res, result);
  }),
};
