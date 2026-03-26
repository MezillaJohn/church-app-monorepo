import { Notification, type NotificationType } from '../../database/models/notification.model';
import { PushToken } from '../../database/models/push-token.model';
import { PushService } from './push.service';
import { logger } from '../utils/logger';

interface NotifyAllPayload {
  type: NotificationType;
  title: string;
  body: string;
  resourceId?: string;
}

/**
 * Central notification service.
 * - Stores a notification record per user in DB
 * - Sends push notification to all devices
 * - Includes deep link data in push payload
 */
export const NotificationService = {
  /**
   * Notify ALL users: creates a notification record for each user with a push token,
   * then sends push to all devices.
   */
  async notifyAll(payload: NotifyAllPayload) {
    const { type, title, body, resourceId } = payload;

    // Get all unique user IDs that have push tokens
    const userIds = await PushToken.distinct('userId');

    if (userIds.length === 0) {
      logger.info('No users with push tokens — skipping notification');
      return { sent: 0, failed: 0 };
    }

    // Bulk insert notification records for all users
    const notificationDocs = userIds.map((userId) => ({
      type,
      userId,
      title,
      body,
      resourceId: resourceId ?? null,
    }));

    await Notification.insertMany(notificationDocs);

    // Send push with deep link data
    const result = await PushService.sendToAll({
      title,
      body,
      data: { type, resourceId: resourceId ?? '', screen: getScreen(type) },
    });

    logger.info('Notification sent to all users', {
      type,
      users: userIds.length,
      sent: result.sent,
      failed: result.failed,
    });

    return result;
  },

  /**
   * Notify a single user: creates notification record + sends push.
   */
  async notifyUser(userId: string, payload: NotifyAllPayload) {
    const { type, title, body, resourceId } = payload;

    await Notification.create({
      type,
      userId,
      title,
      body,
      resourceId: resourceId ?? null,
    });

    const result = await PushService.sendToUser(userId, {
      title,
      body,
      data: { type, resourceId: resourceId ?? '', screen: getScreen(type) },
    });

    return result;
  },
};

function getScreen(type: NotificationType): string {
  switch (type) {
    case 'sermon':
      return 'sermon';
    case 'book':
      return 'book';
    case 'event':
      return 'event';
    case 'announcement':
    default:
      return 'announcement';
  }
}
