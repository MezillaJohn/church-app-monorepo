import { z } from 'zod';

export const adminBankAccountQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const createBankAccountSchema = z.object({
  title: z.string().optional(),
  bankName: z.string().min(1).max(255),
  accountName: z.string().min(1).max(255),
  accountNumber: z.string().min(1).max(50),
  sortCode: z.string().optional(),
  currency: z.string().default('NGN'),
  isActive: z.boolean().default(true),
});

export const updateBankAccountSchema = createBankAccountSchema.partial();
export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminBankAccountQueryInput = z.infer<typeof adminBankAccountQuerySchema>;
export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>;
