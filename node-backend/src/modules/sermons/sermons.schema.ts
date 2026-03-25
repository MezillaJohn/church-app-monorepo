import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const sermonQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  categoryId: mongoId.optional(),
  seriesId: mongoId.optional(),
  type: z.enum(['audio', 'video']).optional(),
  speaker: z.string().optional(),
});

export const updateProgressSchema = z.object({
  progressSeconds: z.number().int().min(0),
  completed: z.boolean().optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type SermonQueryInput = z.infer<typeof sermonQuerySchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
