import { Notification } from '../../database/models/notification.model';
import { AppError } from '../../shared/middleware/error.middleware';

export const NotificationsService = {
  async findAll(userId: string) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
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
