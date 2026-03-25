import { Router } from 'express';
import { PartnershipsController } from './partnerships.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { createPartnershipSchema } from './partnerships.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/types', PartnershipsController.types);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.post('/', authenticate, requireVerified, validate({ body: createPartnershipSchema }), PartnershipsController.store);

export default router;
