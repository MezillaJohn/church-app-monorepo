import { z } from 'zod';

export const adminPartnershipTypeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const createPartnershipTypeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updatePartnershipTypeSchema = createPartnershipTypeSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminPartnershipTypeQueryInput = z.infer<typeof adminPartnershipTypeQuerySchema>;
export type CreatePartnershipTypeInput = z.infer<typeof createPartnershipTypeSchema>;
export type UpdatePartnershipTypeInput = z.infer<typeof updatePartnershipTypeSchema>;
