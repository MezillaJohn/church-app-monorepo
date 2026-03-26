import { PushToken } from '../../../database/models/push-token.model';
import { Notification } from '../../../database/models/notification.model';
import { PushService } from '../../../shared/services/push.service';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import { logger } from '../../../shared/utils/logger';
import type { SendPushNotificationInput, AdminNotificationQueryInput } from './notifications.schema';

export const AdminNotificationsService = {
  async sendPush(input: SendPushNotificationInput) {
    const payload = {
      title: input.title,
      body: input.body,
      data: input.data,
    };

    let result: { sent: number; failed: number };

    if (input.targetType === 'user' && input.userId) {
      result = await PushService.sendToUser(input.userId, payload);
    } else {
      result = await PushService.sendToAll(payload);
    }

    // Log notification in history for each targeted user
    if (input.targetType === 'user' && input.userId) {
      await Notification.create({
        type: 'push',
        userId: input.userId,
        data: { title: input.title, body: input.body },
      });
    }

    logger.info('Push notifications sent via admin', {
      sent: result.sent,
      failed: result.failed,
      targetType: input.targetType,
    });

    return { sent: result.sent, failed: result.failed };
  },

  async findAll(query: AdminNotificationQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};

    if (query.userId) filter['userId'] = query.userId;
    if (query.type) filter['type'] = query.type;

    const [data, total] = await Promise.all([
      Notification.find(filter)
        .populate({ path: 'userId', select: 'name email' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Notification.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },
};
