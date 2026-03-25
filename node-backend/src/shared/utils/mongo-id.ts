import { z } from 'zod';

/**
 * Validates a string is a valid 24-char hex MongoDB ObjectId.
 */
export const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

export const idParamSchema = z.object({ id: mongoId });
