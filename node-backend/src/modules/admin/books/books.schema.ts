import { z } from 'zod';

const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url().optional(),
);
const optionalId = z.preprocess((v) => (v === '' ? undefined : v), z.string().optional());

export const adminBookQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
});

export const createBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().min(0),
  coverImage: optionalUrl,
  fileUrl: optionalUrl,
  previewPages: optionalUrl,
  categoryId: optionalId,
  subaccountId: optionalId,
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const updateBookSchema = createBookSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminBookQueryInput = z.infer<typeof adminBookQuerySchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
