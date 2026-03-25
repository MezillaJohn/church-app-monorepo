import { z } from 'zod';

const optionalId = z.preprocess((v) => (v === '' ? undefined : v), z.string().optional());

export const adminDonationTypeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const createDonationTypeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  subaccountId: optionalId,
  isActive: z.boolean().default(true),
});

export const updateDonationTypeSchema = createDonationTypeSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminDonationTypeQueryInput = z.infer<typeof adminDonationTypeQuerySchema>;
export type CreateDonationTypeInput = z.infer<typeof createDonationTypeSchema>;
export type UpdateDonationTypeInput = z.infer<typeof updateDonationTypeSchema>;
