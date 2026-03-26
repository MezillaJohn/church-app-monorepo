import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database/connection';
import { PushTokensService } from './modules/push-tokens/push-tokens.service';
import { logger } from './shared/utils/logger';

const server = app.listen(env.PORT, async () => {
  await connectDatabase();
  logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);

  // Clean up push tokens older than 90 days on startup
  PushTokensService.cleanupStaleTokens(90).catch((err) =>
    logger.error('Stale token cleanup failed', { err }),
  );
});

// ─── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    await disconnectDatabase();
    logger.info('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  shutdown('uncaughtException');
});
