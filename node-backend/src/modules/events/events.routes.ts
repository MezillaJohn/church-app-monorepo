import { Router } from 'express';
import { EventsController } from './events.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { eventQuerySchema, idParamSchema } from './events.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
// Named routes must come before /:id to avoid conflicts
router.get('/live', EventsController.live);

router.get('/', validate({ query: eventQuerySchema }), EventsController.index);
router.get('/:id', validate({ params: idParamSchema }), EventsController.show);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.get('/my-rsvps', authenticate, requireVerified, EventsController.myRsvps);
router.post('/:id/rsvp', authenticate, requireVerified, validate({ params: idParamSchema }), EventsController.rsvp);
router.delete('/:id/rsvp', authenticate, requireVerified, validate({ params: idParamSchema }), EventsController.cancelRsvp);

export default router;
