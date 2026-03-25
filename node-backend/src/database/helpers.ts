/**
 * Applied to every Mongoose schema.
 * - Adds `createdAt` / `updatedAt` via timestamps.
 * - toJSON: Mongoose auto-creates an `id` virtual (string form of `_id`),
 *   then we remove `_id` and `__v` so API responses are clean.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseSchemaOptions: Record<string, any> = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      // Keep _id as a plain string so API consumers can use either _id or id
      if (ret['_id']) ret['_id'] = String(ret['_id']);
      Reflect.deleteProperty(ret, '__v');
    },
  },
  toObject: { virtuals: true },
};
