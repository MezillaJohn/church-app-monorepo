import { z } from 'zod';

export const sendPushNotificationSchema = z
  .object({
    title: z.string().min(1).max(255),
    body: z.string().min(1),
    data: z.record(z.unknown()).optional(),
    targetType: z.enum(['all', 'user']),
    userId: z.string().optional(),
  })
  .refine((d) => d.targetType !== 'user' || !!d.userId, {
    message: 'userId is required when targetType is "user"',
    path: ['userId'],
  });

export const adminNotificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  userId: z.string().optional(),
  type: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });

export type SendPushNotificationInput = z.infer<typeof sendPushNotificationSchema>;
export type AdminNotificationQueryInput = z.infer<typeof adminNotificationQuerySchema>;
