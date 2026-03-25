import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
