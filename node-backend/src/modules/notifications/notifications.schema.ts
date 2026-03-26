import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const idParamSchema = z.object({
  id: mongoId,
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(20),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
