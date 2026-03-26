import { Router } from 'express';
import { SupportTicketsController } from './support-tickets.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { createTicketSchema } from './support-tickets.schema';

const router = Router();

router.use(authenticate, requireVerified);
router.post('/', validate({ body: createTicketSchema }), SupportTicketsController.create);
router.get('/my-tickets', SupportTicketsController.myTickets);

export default router;
