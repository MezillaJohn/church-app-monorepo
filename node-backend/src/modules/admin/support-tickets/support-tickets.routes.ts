import { Router } from 'express';
import { AdminSupportTicketsController } from './support-tickets.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { ticketQuerySchema, respondTicketSchema, idParamSchema } from './support-tickets.schema';

const router = Router();

router.get('/', validate({ query: ticketQuerySchema }), AdminSupportTicketsController.index);
router.get('/:id', validate({ params: idParamSchema }), AdminSupportTicketsController.show);
router.post('/:id/respond', validate({ params: idParamSchema, body: respondTicketSchema }), AdminSupportTicketsController.respond);
router.delete('/:id', validate({ params: idParamSchema }), AdminSupportTicketsController.delete);

export default router;
