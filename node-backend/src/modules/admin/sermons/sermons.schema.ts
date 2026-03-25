import { z } from 'zod';

export const adminSermonQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  type: z.enum(['audio', 'video']).optional(),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
});

// Accepts a valid URL or empty string (treated as absent)
const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url().optional(),
);

// Accepts a non-empty string ID or empty string (treated as absent)
const optionalId = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().optional(),
);

export const createSermonSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['audio', 'video']),
  speaker: z.string().optional(),
  date: z.string().datetime().or(z.string().min(1)),
  audioFileUrl: optionalUrl,
  youtubeVideoId: z.string().optional(),
  youtubeVideoUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  duration: z.number().int().positive().optional(),
  categoryId: optionalId,
  seriesId: optionalId,
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const updateSermonSchema = createSermonSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminSermonQueryInput = z.infer<typeof adminSermonQuerySchema>;
export type CreateSermonInput = z.infer<typeof createSermonSchema>;
export type UpdateSermonInput = z.infer<typeof updateSermonSchema>;
