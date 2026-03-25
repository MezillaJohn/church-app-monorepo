import { z } from 'zod';

export const adminPartnershipQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  partnershipTypeId: z.string().optional(),
  interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  userId: z.string().optional(),
});

export const createPartnershipSchema = z.object({
  fullname: z.string().min(1).max(255),
  phoneNo: z.string().min(1),
  email: z.string().email(),
  partnershipTypeId: z.string().min(1),
  interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  userId: z.string().optional(),
});

export const updatePartnershipSchema = createPartnershipSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminPartnershipQueryInput = z.infer<typeof adminPartnershipQuerySchema>;
export type CreatePartnershipInput = z.infer<typeof createPartnershipSchema>;
export type UpdatePartnershipInput = z.infer<typeof updatePartnershipSchema>;
