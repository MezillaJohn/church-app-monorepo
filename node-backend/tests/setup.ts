import { afterAll, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { env } from '../src/config/env';

beforeAll(async () => {
  // Connect to a dedicated test database
  const testUri = env.MONGODB_URI.replace(/\/(\w+)(\?|$)/, '/church_app_test$2');
  await mongoose.connect(testUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
