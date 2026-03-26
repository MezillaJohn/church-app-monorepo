import { Notification } from '../../database/models/notification.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../shared/utils/pagination';
import type { NotificationQueryInput } from './notifications.schema';

export const NotificationsService = {
  async findAll(userId: string, query: NotificationQueryInput) {
    const { skip, take, page, perPage } = paginate(query);

    const [data, total, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(take),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, readAt: null }),
    ]);

    return {
      data,
      meta: { ...buildPaginationMeta(total, page, perPage), unreadCount },
    };
  },

  async markAsRead(userId: string, notificationId: string) {
    const notification = await Notification.findById(notificationId);

    if (!notification || notification.userId.toString() !== userId) {
      throw new AppError('Notification not found', 404);
    }

    return Notification.findByIdAndUpdate(
      notificationId,
      { $set: { readAt: new Date() } },
      { new: true },
    );
  },

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { userId, readAt: null },
      { $set: { readAt: new Date() } },
    );
  },
};
