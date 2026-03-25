import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const createPushTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android']).optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type CreatePushTokenInput = z.infer<typeof createPushTokenSchema>;
