import { z } from 'zod';

const EVENT_TYPES = ['service', 'conference', 'prayer', 'youth', 'children'] as const;

const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url('Must be a valid URL').optional(),
);

const datetimeString = (label: string) =>
  z.string({ required_error: `${label} is required` }).min(1, `${label} is required`);

export const adminEventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  eventType: z.enum(EVENT_TYPES).optional(),
  isPublished: z.coerce.boolean().optional(),
});

export const createEventSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    eventDate: datetimeString('Start date & time'),
    endDate: datetimeString('End date & time'),
    location: z.string().optional(),
    eventType: z.enum(EVENT_TYPES, {
      errorMap: () => ({ message: `Event type must be one of: ${EVENT_TYPES.join(', ')}` }),
    }),
    imageUrl: optionalUrl,
    maxAttendees: z.number().int().positive().optional(),
    requiresRsvp: z.boolean().default(false),
    isPublished: z.boolean().default(true),
    isLive: z.boolean().default(false),
    broadcastUrl: optionalUrl,
    isRecurring: z.boolean().default(false),
    recurrencePattern: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.eventDate);
    const end = new Date(data.endDate);
    if (isNaN(start.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid start date/time', path: ['eventDate'] });
    }
    if (isNaN(end.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid end date/time', path: ['endDate'] });
    }
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End date/time must be after start date/time', path: ['endDate'] });
    }
  });

export const updateEventSchema = createEventSchema.innerType().partial().superRefine((data, ctx) => {
  if (data.eventDate && data.endDate) {
    const start = new Date(data.eventDate);
    const end = new Date(data.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End date/time must be after start date/time', path: ['endDate'] });
    }
  }
});

export const idParamSchema = z.object({ id: z.string().min(1) });

export type AdminEventQueryInput = z.infer<typeof adminEventQuerySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
