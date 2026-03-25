import { z } from 'zod';

const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url().optional(),
);

export const adminHeroSliderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const createHeroSliderSchema = z.object({
  title: z.string().optional(),
  imageUrl: z.string().min(1),
  linkUrl: optionalUrl,
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateHeroSliderSchema = createHeroSliderSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminHeroSliderQueryInput = z.infer<typeof adminHeroSliderQuerySchema>;
export type CreateHeroSliderInput = z.infer<typeof createHeroSliderSchema>;
export type UpdateHeroSliderInput = z.infer<typeof updateHeroSliderSchema>;
