import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { verifyPaymentSchema, idParamSchema } from './payments.schema';

const router = Router();

// ─── Public (Paystack webhook — must not require auth) ────────────────────────
router.post('/webhook/paystack', PaymentsController.handleWebhook);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.post(
  '/books/:id/purchase',
  authenticate,
  requireVerified,
  validate({ params: idParamSchema }),
  PaymentsController.purchaseBook,
);

router.post(
  '/verify',
  authenticate,
  requireVerified,
  validate({ body: verifyPaymentSchema }),
  PaymentsController.verifyPayment,
);

export default router;
