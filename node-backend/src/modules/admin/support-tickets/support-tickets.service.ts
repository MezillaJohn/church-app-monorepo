import { SupportTicket } from '../../../database/models/support-ticket.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { EmailService } from '../../../shared/services/email.service';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { TicketQueryInput, RespondTicketInput } from './support-tickets.schema';

export const AdminSupportTicketsService = {
  async findAll(query: TicketQueryInput) {
    const { skip, take, page, perPage } = paginate(query);

    const filter: Record<string, unknown> = {};
    if (query.status) filter['status'] = query.status;
    if (query.search) {
      const re = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter['$or'] = [{ subject: re }, { message: re }];
    }

    const [data, total] = await Promise.all([
      SupportTicket.find(filter)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      SupportTicket.countDocuments(filter),
    ]);

    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const ticket = await SupportTicket.findById(id).populate('userId', 'name email phone');
    if (!ticket) throw new AppError('Support ticket not found', 404);
    return ticket;
  },

  async respond(id: string, input: RespondTicketInput) {
    const ticket = await SupportTicket.findById(id).populate('userId', 'name email');
    if (!ticket) throw new AppError('Support ticket not found', 404);

    ticket.adminResponse = input.adminResponse;
    ticket.status = input.status ?? 'resolved';
    ticket.respondedAt = new Date();
    await ticket.save();

    // Send email to user
    const user = ticket.userId as unknown as { name: string; email: string };
    if (user?.email) {
      await EmailService.sendMail({
        to: user.email,
        subject: `Re: ${ticket.subject}`,
        html: `
          <h3>Hi ${user.name},</h3>
          <p>We've responded to your support request:</p>
          <blockquote style="border-left: 3px solid #7c3aed; padding-left: 12px; color: #555;">
            <strong>Your message:</strong><br/>
            ${ticket.message}
          </blockquote>
          <p><strong>Our response:</strong></p>
          <p>${input.adminResponse}</p>
          <br/>
          <p>If you need further help, please submit another support request through the app.</p>
          <p>— Support Team</p>
        `,
      });
    }

    return ticket;
  },

  async updateStatus(id: string, status: string) {
    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate('userId', 'name email phone');
    if (!ticket) throw new AppError('Support ticket not found', 404);
    return ticket;
  },

  async delete(id: string) {
    const ticket = await SupportTicket.findByIdAndDelete(id);
    if (!ticket) throw new AppError('Support ticket not found', 404);
  },
};
