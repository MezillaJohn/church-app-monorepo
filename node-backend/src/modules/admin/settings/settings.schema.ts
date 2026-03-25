import { z } from 'zod';

export const upsertSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().optional(),
  type: z.enum(['string', 'integer', 'boolean']).default('string'),
  group: z.string().default('general'),
  description: z.string().optional(),
});

export const batchUpsertSettingsSchema = z.object({
  settings: z.array(upsertSettingSchema).min(1),
});

export const groupQuerySchema = z.object({
  group: z.string().optional(),
});

export const keyParamSchema = z.object({ key: z.string().min(1) });

export type UpsertSettingInput = z.infer<typeof upsertSettingSchema>;
export type BatchUpsertSettingsInput = z.infer<typeof batchUpsertSettingsSchema>;
export type GroupQueryInput = z.infer<typeof groupQuerySchema>;
