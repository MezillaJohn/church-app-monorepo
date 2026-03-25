import https from 'https';
import { PushToken } from '../../../database/models/push-token.model';
import { Notification } from '../../../database/models/notification.model';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import { logger } from '../../../shared/utils/logger';
import type { SendPushNotificationInput, AdminNotificationQueryInput } from './notifications.schema';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const BATCH_SIZE = 100;

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

async function sendExpoBatch(messages: ExpoPushMessage[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(messages);
    const url = new URL(EXPO_PUSH_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data) as { data?: { status: string; details?: { error?: string } }[] };
          const errors = parsed.data?.filter((r) => r.status === 'error') ?? [];
          if (errors.length > 0) {
            logger.warn('Expo push errors', { errors });
          }
        } catch {
          // ignore parse errors
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      logger.error('Expo push request failed', { err });
      reject(err);
    });

    req.write(body);
    req.end();
  });
}

export const AdminNotificationsService = {
  async sendPush(input: SendPushNotificationInput) {
    const filter = input.targetType === 'user' ? { userId: input.userId } : {};
    const tokens = await PushToken.find(filter).select('token');

    if (tokens.length === 0) {
      return { sent: 0, message: 'No push tokens found' };
    }

    const messages: ExpoPushMessage[] = tokens.map((t) => ({
      to: t.token,
      title: input.title,
      body: input.body,
      ...(input.data && { data: input.data }),
    }));

    // Send in batches of BATCH_SIZE
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      await sendExpoBatch(messages.slice(i, i + BATCH_SIZE));
    }

    logger.info('Push notifications sent', { count: tokens.length, targetType: input.targetType });
    return { sent: tokens.length };
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
