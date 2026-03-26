import { z } from 'zod';
import { mongoId } from '../../../shared/utils/mongo-id';

export const ticketQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  status: z.enum(['open', 'in-progress', 'resolved']).optional(),
});

export const respondTicketSchema = z.object({
  adminResponse: z.string().min(1).max(5000),
  status: z.enum(['open', 'in-progress', 'resolved']).optional(),
});

export const idParamSchema = z.object({
  id: mongoId,
});

export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
export type RespondTicketInput = z.infer<typeof respondTicketSchema>;
