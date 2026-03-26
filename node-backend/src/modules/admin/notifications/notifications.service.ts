import { Notification } from '../../../database/models/notification.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import { logger } from '../../../shared/utils/logger';
import type { SendPushNotificationInput, AdminNotificationQueryInput } from './notifications.schema';

export const AdminNotificationsService = {
  async sendPush(input: SendPushNotificationInput) {
    if (input.targetType === 'user' && input.userId) {
      return NotificationService.notifyUser(input.userId, {
        type: 'announcement',
        title: input.title,
        body: input.body,
      });
    }

    return NotificationService.notifyAll({
      type: 'announcement',
      title: input.title,
      body: input.body,
    });
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
