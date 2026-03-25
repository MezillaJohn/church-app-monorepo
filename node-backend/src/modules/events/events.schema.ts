import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const eventQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  eventType: z.enum(['service', 'conference', 'prayer', 'youth', 'children']).optional(),
  upcoming: z.coerce.boolean().optional(),
  is_live: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type EventQueryInput = z.infer<typeof eventQuerySchema>;
