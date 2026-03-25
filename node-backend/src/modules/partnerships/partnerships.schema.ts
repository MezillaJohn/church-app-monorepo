import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const createPartnershipSchema = z.object({
  fullname: z.string().min(2),
  phoneNo: z.string(),
  email: z.string().email(),
  partnershipTypeId: mongoId,
  interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
});

export type CreatePartnershipInput = z.infer<typeof createPartnershipSchema>;
