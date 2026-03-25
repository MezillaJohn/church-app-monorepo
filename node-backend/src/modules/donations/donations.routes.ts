import { Router } from 'express';
import { DonationsController } from './donations.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { donateSchema } from './donations.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/types', DonationsController.types);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.post('/donate', authenticate, requireVerified, validate({ body: donateSchema }), DonationsController.donate);
router.get('/history', authenticate, requireVerified, DonationsController.history);
router.get('/total', authenticate, requireVerified, DonationsController.total);

export default router;
