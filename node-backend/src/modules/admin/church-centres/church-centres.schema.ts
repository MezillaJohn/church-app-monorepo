import { z } from 'zod';

export const adminChurchCentreQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export const createChurchCentreSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('Nigeria'),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  isActive: z.boolean().default(true),
});

export const updateChurchCentreSchema = createChurchCentreSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminChurchCentreQueryInput = z.infer<typeof adminChurchCentreQuerySchema>;
export type CreateChurchCentreInput = z.infer<typeof createChurchCentreSchema>;
export type UpdateChurchCentreInput = z.infer<typeof updateChurchCentreSchema>;
