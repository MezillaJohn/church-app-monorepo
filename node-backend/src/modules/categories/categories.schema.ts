import { z } from 'zod';

export const categoryQuerySchema = z.object({
  type: z.enum(['sermon', 'book', 'giving']).optional(),
});

export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
