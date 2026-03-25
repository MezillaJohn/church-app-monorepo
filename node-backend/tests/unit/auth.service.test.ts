import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../src/modules/auth/auth.service';
import { AppError } from '../../src/shared/middleware/error.middleware';
import { db } from '../../src/database/client';

vi.mock('../../src/database/client', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
    verificationCode: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('../../src/config/env', () => ({
  env: {
    JWT_ACCESS_SECRET: 'test-access-secret-that-is-long-enough',
    JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-long-enough',
    JWT_ACCESS_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
    NODE_ENV: 'test',
  },
}));

const mockDb = db as unknown as {
  user: Record<string, ReturnType<typeof vi.fn>>;
};

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('throws 409 if email already registered', async () => {
      mockDb.user['findUnique'].mockResolvedValue({ id: 1, email: 'test@test.com' });

      await expect(
        AuthService.register({ name: 'Test', email: 'test@test.com', password: 'password123' }),
      ).rejects.toThrow(AppError);
    });

    it('creates user when email is unique', async () => {
      mockDb.user['findUnique'].mockResolvedValue(null);
      mockDb.user['create'].mockResolvedValue({ id: 1, name: 'Test', email: 'test@test.com' });

      const result = await AuthService.register({
        name: 'Test',
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toMatchObject({ id: 1, name: 'Test', email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('throws 401 with invalid credentials', async () => {
      mockDb.user['findUnique'].mockResolvedValue(null);

      await expect(
        AuthService.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(AppError);
    });
  });
});
