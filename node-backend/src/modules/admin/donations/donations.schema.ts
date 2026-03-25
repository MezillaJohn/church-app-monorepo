import { z } from 'zod';

export const adminDonationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  userId: z.string().optional(),
  donationTypeId: z.string().optional(),
  paymentMethod: z.enum(['paystack', 'manual']).optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});

export const createDonationSchema = z.object({
  userId: z.string().min(1),
  donationTypeId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  paymentMethod: z.enum(['paystack', 'manual']),
  transactionReference: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  note: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export const updateDonationSchema = createDonationSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminDonationQueryInput = z.infer<typeof adminDonationQuerySchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;
