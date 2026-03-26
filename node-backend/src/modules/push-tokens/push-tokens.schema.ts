import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

const deviceInfoSchema = z.object({
  brand: z.string().nullish(),
  manufacturer: z.string().nullish(),
  modelName: z.string().nullish(),
  osName: z.string().nullish(),
  osVersion: z.string().nullish(),
}).optional();

export const createPushTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android']).optional(),
  device_info: z.union([deviceInfoSchema, z.array(deviceInfoSchema)]).optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type CreatePushTokenInput = z.infer<typeof createPushTokenSchema>;
