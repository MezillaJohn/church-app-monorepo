import Expo from 'expo-server-sdk';
import { PushToken } from '../../database/models/push-token.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { logger } from '../../shared/utils/logger';
import type { CreatePushTokenInput } from './push-tokens.schema';

export const PushTokensService = {
  async findAll(userId: string) {
    return PushToken.find({ userId }).sort({ lastUsedAt: -1 });
  },

  /**
   * Register or refresh a push token.
   * - Validates token format (must be a valid Expo push token)
   * - Upserts by token value (same token = update, not duplicate)
   * - Stores device info and updates lastUsedAt
   * - If token was previously owned by another user, reassigns it
   *   (user switched accounts on same device)
   */
  async upsert(userId: string, input: CreatePushTokenInput) {
    // Validate Expo push token format
    if (!Expo.isExpoPushToken(input.token)) {
      throw new AppError('Invalid Expo push token format', 400);
    }

    // Normalize device_info (frontend sends as array, we store as object)
    const rawDeviceInfo = Array.isArray(input.device_info)
      ? input.device_info[0]
      : input.device_info;

    const deviceInfo = rawDeviceInfo
      ? {
          brand: rawDeviceInfo.brand ?? null,
          manufacturer: rawDeviceInfo.manufacturer ?? null,
          modelName: rawDeviceInfo.modelName ?? null,
          osName: rawDeviceInfo.osName ?? null,
          osVersion: rawDeviceInfo.osVersion ?? null,
        }
      : undefined;

    return PushToken.findOneAndUpdate(
      { token: input.token },
      {
        $set: {
          userId,
          token: input.token,
          lastUsedAt: new Date(),
          ...(input.platform && { platform: input.platform }),
          ...(deviceInfo && { deviceInfo }),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },

  /**
   * Remove a specific token (user-initiated, e.g. logout from a device).
   */
  async destroy(userId: string, tokenId: string) {
    const pushToken = await PushToken.findById(tokenId);
    if (!pushToken) throw new AppError('Push token not found', 404);
    if (pushToken.userId.toString() !== userId) throw new AppError('Forbidden', 403);

    await PushToken.deleteOne({ _id: tokenId });
  },

  /**
   * Remove all tokens for a user (called on account deletion or full logout).
   */
  async removeAllForUser(userId: string) {
    const result = await PushToken.deleteMany({ userId });
    logger.info(`Removed ${result.deletedCount} push tokens for user ${userId}`);
  },

  /**
   * Remove a specific token string (called on logout from mobile app).
   */
  async removeByToken(token: string) {
    await PushToken.deleteOne({ token });
  },

  /**
   * Clean up stale tokens that haven't been used in 90 days.
   * Should be run periodically (e.g. daily cron or on server start).
   */
  async cleanupStaleTokens(daysOld = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    const result = await PushToken.deleteMany({ lastUsedAt: { $lt: cutoff } });
    if (result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} stale push tokens (older than ${daysOld} days)`);
    }
    return result.deletedCount;
  },
};
