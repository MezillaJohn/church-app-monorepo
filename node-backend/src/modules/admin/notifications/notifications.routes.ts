import { Router } from 'express';
import { AdminNotificationsController } from './notifications.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { sendPushNotificationSchema, adminNotificationQuerySchema } from './notifications.schema';

const router = Router();

router.post('/push', validate({ body: sendPushNotificationSchema }), AdminNotificationsController.sendPush);
router.get('/', validate({ query: adminNotificationQuerySchema }), AdminNotificationsController.index);

export default router;
