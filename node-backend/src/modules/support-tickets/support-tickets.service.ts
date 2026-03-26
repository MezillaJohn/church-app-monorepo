import { SupportTicket } from '../../database/models/support-ticket.model';
import type { CreateTicketInput } from './support-tickets.schema';

export const SupportTicketsService = {
  async create(userId: string, input: CreateTicketInput) {
    return SupportTicket.create({ ...input, userId });
  },

  async findByUser(userId: string) {
    return SupportTicket.find({ userId }).sort({ createdAt: -1 });
  },
};
