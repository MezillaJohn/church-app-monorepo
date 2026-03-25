import { z } from 'zod';

const optionalId = z.preprocess((v) => (v === '' ? undefined : v), z.string().optional());

export const adminUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  churchMember: z.coerce.boolean().optional(),
  isAdmin: z.coerce.boolean().optional(),
  emailVerified: z.coerce.boolean().optional(),
  churchCentreId: z.string().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  country: z.string().optional(),
  churchMember: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  churchCentreId: optionalId,
  emailVerifiedAt: z.string().datetime().optional(),
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .extend({ password: z.string().min(6).optional() })
  .partial();

export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
