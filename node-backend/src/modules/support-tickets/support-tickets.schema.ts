import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
