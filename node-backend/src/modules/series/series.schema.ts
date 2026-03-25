import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const seriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type SeriesQueryInput = z.infer<typeof seriesQuerySchema>;
