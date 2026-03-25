import { Schema, model, Types } from 'mongoose';
import { baseSchemaOptions } from '../helpers';

// ─── Embedded subdocument ──────────────────────────────────────────────────────

export interface IVerificationCode {
  _id: Types.ObjectId;
  code: string;
  expiresAt: Date;
  usedAt?: Date;
}

// ─── Main interface ────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailVerifiedAt?: Date | null;
  password: string; // select: false by default
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  country?: string;
  churchMember: boolean;
  isAdmin: boolean;
  churchCentreId?: Types.ObjectId;
  passwordResetToken?: string; // select: false
  passwordResetExpiresAt?: Date; // select: false
  verificationCodes: IVerificationCode[]; // select: false
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const verificationCodeSchema = new Schema<IVerificationCode>(
  {
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerifiedAt: { type: Date, default: null },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    country: { type: String },
    churchMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    churchCentreId: { type: Schema.Types.ObjectId, ref: 'ChurchCentre' },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    verificationCodes: { type: [verificationCodeSchema], default: [], select: false },
  },
  baseSchemaOptions,
);

userSchema.index({ churchCentreId: 1 });

export const User = model<IUser>('User', userSchema);
