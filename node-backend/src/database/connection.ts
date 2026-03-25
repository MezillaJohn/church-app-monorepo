import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../shared/utils/logger';

const RETRY_DELAY_MS = 5_000;
const MAX_RETRIES = 5;

export async function connectDatabase(retries = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect('mongodb+srv://mezillaperewei_db_user:QIkeRxsnovG5Lnfa@cluster0.7ivwmal.mongodb.net/?appName=Cluster0', {
      serverSelectionTimeoutMS: 5_000,
    });

    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime error', { err });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s… (${retries} left)`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDatabase(retries - 1);
    }
    logger.error('MongoDB failed to connect after all retries', { error });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
