import { PushToken } from '../../database/models/push-token.model';
import { AppError } from '../../shared/middleware/error.middleware';
import type { CreatePushTokenInput } from './push-tokens.schema';

export const PushTokensService = {
  async findAll(userId: string) {
    return PushToken.find({ userId }).sort({ createdAt: -1 });
  },

  async upsert(userId: string, input: CreatePushTokenInput) {
    return PushToken.findOneAndUpdate(
      { token: input.token },
      {
        $set: {
          userId,
          token: input.token,
          ...(input.platform && { platform: input.platform }),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },

  async destroy(userId: string, tokenId: string) {
    const pushToken = await PushToken.findById(tokenId);

    if (!pushToken) throw new AppError('Push token not found', 404);
    if (pushToken.userId.toString() !== userId) throw new AppError('Forbidden', 403);

    await PushToken.deleteOne({ _id: tokenId });
  },
};
