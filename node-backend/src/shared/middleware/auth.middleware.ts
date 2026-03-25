import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../database/models/user.model';
import { ApiResponse } from '../utils/api-response';

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Verifies the Bearer token and attaches the user to req.user.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Unauthorized', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as JwtPayload;

    const user = await User.findById(payload.sub).select('email name isAdmin emailVerifiedAt');

    if (!user) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      emailVerifiedAt: user.emailVerifiedAt,
    };
    next();
  } catch {
    ApiResponse.error(res, 'Unauthorized — invalid or expired token', 401);
  }
};

/**
 * Requires that the authenticated user has verified their email.
 */
export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.emailVerifiedAt) {
    ApiResponse.error(res, 'Please verify your email address first', 403);
    return;
  }
  next();
};

/**
 * Requires admin role.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    ApiResponse.error(res, 'Forbidden', 403);
    return;
  }
  next();
};
