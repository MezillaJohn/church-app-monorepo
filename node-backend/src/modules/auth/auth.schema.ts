import { z } from 'zod';
import { mongoId } from '../../shared/utils/mongo-id';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  churchCentreId: mongoId.optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
  password: z.string().min(8).max(100),
  password_confirmation: z.string().min(8).max(100).optional(),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(4).max(10),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  country: z.string().optional(),
  churchMember: z.boolean().optional(),
  churchCentreId: mongoId.optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ─── Multi-step signup schemas ────────────────────────────────────────────────

export const validateEmailSchema = z.object({
  email: z.string().email(),
});

export const requestCodeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
});

export const setPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  churchCentreId: mongoId.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
export type RequestCodeInput = z.infer<typeof requestCodeSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
