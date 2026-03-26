import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { idParamSchema, notificationQuerySchema } from './notifications.schema';

const router = Router();

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.use(authenticate, requireVerified);

// Named routes must come before /:id to avoid conflicts
router.patch('/read-all', NotificationsController.markAllAsRead);

router.get('/', validate({ query: notificationQuerySchema }), NotificationsController.index);
router.patch('/:id/read', validate({ params: idParamSchema }), NotificationsController.markAsRead);

export default router;
