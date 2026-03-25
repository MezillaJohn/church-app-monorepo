import { Router } from 'express';
import { PushTokensController } from './push-tokens.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { createPushTokenSchema, idParamSchema } from './push-tokens.schema';

const router = Router();

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.use(authenticate, requireVerified);

router.get('/', PushTokensController.index);
router.post('/', validate({ body: createPushTokenSchema }), PushTokensController.store);
router.delete('/:id', validate({ params: idParamSchema }), PushTokensController.destroy);

export default router;
