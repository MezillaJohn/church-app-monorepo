import { z } from 'zod';

export const adminSeriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url().optional(),
);

export const createSeriesSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  slug: z.string().max(255).optional(),
  preacher: z.string().optional(),
  imageUrl: optionalUrl,
  isActive: z.boolean().default(true),
});

export const updateSeriesSchema = createSeriesSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminSeriesQueryInput = z.infer<typeof adminSeriesQuerySchema>;
export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
