import { Schema, model } from 'mongoose';

interface IPendingVerification {
  email: string;
  name: string;
  code: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pendingVerificationSchema = new Schema<IPendingVerification>(
  {
    email: { type: String, required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Auto-expire documents after 1 hour
pendingVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingVerification = model<IPendingVerification>(
  'PendingVerification',
  pendingVerificationSchema,
);
