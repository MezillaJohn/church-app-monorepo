import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { AnyZodObject } from 'zod';
import { ApiResponse } from '../utils/api-response';

interface ValidateTarget {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Middleware factory that validates request body, query, and/or params with Zod schemas.
 * Returns 422 with field-level errors on validation failure.
 */
export const validate = (schemas: ValidateTarget) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      if (schemas.query) req.query = (await schemas.query.parseAsync(req.query)) as typeof req.query;
      if (schemas.params) req.params = await schemas.params.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        const first = errors[0];
        const message = first
          ? first.field
            ? `${first.field}: ${first.message}`
            : first.message
          : 'Validation failed';
        ApiResponse.error(res, message, 422, errors);
        return;
      }
      next(error);
    }
  };
};
