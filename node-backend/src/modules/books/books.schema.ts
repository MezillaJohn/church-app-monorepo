import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  categoryId: mongoId.optional(),
  isFeatured: z.coerce.boolean().optional(),
  author: z.string().optional(),
});

export const rateBookSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type BookQueryInput = z.infer<typeof bookQuerySchema>;
export type RateBookInput = z.infer<typeof rateBookSchema>;
