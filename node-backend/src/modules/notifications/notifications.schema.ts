import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const idParamSchema = z.object({
  id: mongoId,
});
