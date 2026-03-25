import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const donateSchema = z.object({
  donationTypeId: mongoId.optional(),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  paymentMethod: z.enum(['paystack', 'manual']),
  note: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type DonateInput = z.infer<typeof donateSchema>;
