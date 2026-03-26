import { z } from 'zod';
import { mongoId } from '../../../shared/utils/mongo-id';

export const createServiceTimeSchema = z.object({
  day: z.string().min(1),
  time: z.string().min(1),
  label: z.string().min(1),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateServiceTimeSchema = createServiceTimeSchema.partial();

export const adminServiceTimeQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
});

export const idParamSchema = z.object({ id: mongoId });

export type CreateServiceTimeInput = z.infer<typeof createServiceTimeSchema>;
export type UpdateServiceTimeInput = z.infer<typeof updateServiceTimeSchema>;
export type AdminServiceTimeQueryInput = z.infer<typeof adminServiceTimeQuerySchema>;
