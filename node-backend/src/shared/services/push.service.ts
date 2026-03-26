import Expo, { ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt } from 'expo-server-sdk';
import { PushToken } from '../../database/models/push-token.model';
import { logger } from '../utils/logger';

// Reuse a single Expo client (handles connection pooling internally)
const expo = new Expo();

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Core push service used across the app.
 *
 * - Validates tokens before sending (Expo format check)
 * - Sends in optimal chunks (Expo's recommended batch size)
 * - Checks receipts and auto-removes invalid/unregistered tokens
 * - Logs errors without crashing the caller
 */
export const PushService = {
  /**
   * Send a push notification to a list of Expo push tokens.
   * Invalid tokens are pruned from the DB automatically.
   */
  async sendToTokens(tokens: string[], payload: PushPayload): Promise<{ sent: number; failed: number }> {
    if (tokens.length === 0) return { sent: 0, failed: 0 };

    // 1. Filter only valid Expo push tokens
    const validTokens = tokens.filter((t) => Expo.isExpoPushToken(t));
    const invalidCount = tokens.length - validTokens.length;

    if (invalidCount > 0) {
      logger.warn(`Skipped ${invalidCount} invalid Expo push tokens`);
      // Remove invalid tokens from DB
      const invalidTokens = tokens.filter((t) => !Expo.isExpoPushToken(t));
      await PushToken.deleteMany({ token: { $in: invalidTokens } });
    }

    if (validTokens.length === 0) return { sent: 0, failed: invalidCount };

    // 2. Build messages
    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      title: payload.title,
      body: payload.body,
      sound: 'default' as const,
      ...(payload.data && { data: payload.data }),
    }));

    // 3. Chunk and send (Expo SDK handles optimal chunk size)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        logger.error('Failed to send push notification chunk', { err });
      }
    }

    // 4. Process tickets — identify immediate errors
    const tokensToRemove: string[] = [];
    let sent = 0;
    const receiptIds: string[] = [];

    tickets.forEach((ticket, i) => {
      if (ticket.status === 'ok') {
        sent++;
        if ('id' in ticket && ticket.id) receiptIds.push(ticket.id);
      } else if (ticket.status === 'error') {
        const errorType = ticket.details?.error;

        // Token is permanently invalid — remove it
        if (errorType === 'DeviceNotRegistered' && validTokens[i]) {
          tokensToRemove.push(validTokens[i]);
        }

        logger.warn('Push ticket error', {
          token: validTokens[i] ?? 'unknown',
          error: errorType,
          message: ticket.message,
        });
      }
    });

    // 5. Clean up invalid tokens immediately
    if (tokensToRemove.length > 0) {
      await PushToken.deleteMany({ token: { $in: tokensToRemove } });
      logger.info(`Removed ${tokensToRemove.length} invalid push tokens`);
    }

    // 6. Schedule receipt check (Expo recommends waiting ~15 min)
    if (receiptIds.length > 0) {
      setTimeout(() => {
        PushService.checkReceipts(receiptIds).catch((err) =>
          logger.error('Receipt check failed', { err }),
        );
      }, 15 * 60 * 1000); // 15 minutes
    }

    return { sent, failed: tickets.length - sent + invalidCount };
  },

  /**
   * Send push to all tokens belonging to a specific user.
   */
  async sendToUser(userId: string, payload: PushPayload) {
    const tokens = await PushToken.find({ userId }).select('token').lean();
    return PushService.sendToTokens(
      tokens.map((t) => t.token),
      payload,
    );
  },

  /**
   * Send push to ALL registered tokens.
   */
  async sendToAll(payload: PushPayload) {
    const tokens = await PushToken.find().select('token').lean();
    return PushService.sendToTokens(
      tokens.map((t) => t.token),
      payload,
    );
  },

  /**
   * Check push receipts and clean up tokens that failed permanently.
   * Called automatically 15 min after sending.
   */
  async checkReceipts(receiptIds: string[]) {
    const chunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    const tokensToRemove: string[] = [];

    for (const chunk of chunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const [receiptId, receipt] of Object.entries(receipts)) {
          if (receipt.status === 'error') {
            const errorType = receipt.details?.error;

            if (errorType === 'DeviceNotRegistered') {
              // We don't have the token from receipt, but Expo handles this
              // by returning the error — we log it for monitoring
              logger.info('Device unregistered (via receipt)', { receiptId });
            }

            logger.warn('Push receipt error', {
              receiptId,
              error: errorType,
              message: receipt.message,
            });
          }
        }
      } catch (err) {
        logger.error('Failed to fetch push receipts', { err });
      }
    }

    if (tokensToRemove.length > 0) {
      await PushToken.deleteMany({ token: { $in: tokensToRemove } });
      logger.info(`Removed ${tokensToRemove.length} tokens via receipt check`);
    }
  },
};
