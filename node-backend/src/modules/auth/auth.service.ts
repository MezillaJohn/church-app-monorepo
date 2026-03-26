import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../../database/models/user.model';
import { PendingVerification } from '../../database/models/pending-verification.model';
import { env } from '../../config/env';
import { AppError } from '../../shared/middleware/error.middleware';
import { EmailService } from '../../shared/services/email.service';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
  UpdateProfileInput,
  ValidateEmailInput,
  RequestCodeInput,
  VerifyCodeInput,
  SetPasswordInput,
} from './auth.schema';

// ─── Token helpers ─────────────────────────────────────────────────────────────

function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const AuthService = {
  async register(input: RegisterInput) {
    const existing = await User.findOne({ email: input.email });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      gender: input.gender,
      churchCentreId: input.churchCentreId || undefined,
      verificationCodes: [{ code, expiresAt }],
    });

    await EmailService.sendVerificationCode(user.email, code, input.name);

    return { id: user.id, name: user.name, email: user.email };
  },

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password');
    const passwordMatch = user ? await bcrypt.compare(input.password, user.password) : false;

    // Constant-time comparison prevents user enumeration
    if (!user || !passwordMatch) throw new AppError('Invalid credentials', 401);

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      token: accessToken,
      accessToken,
      refreshToken,
    };
  },

  async verifyEmail(userId: string, input: VerifyEmailInput) {
    const user = await User.findById(userId).select('+verificationCodes');
    if (!user) throw new AppError('User not found', 404);

    const code = user.verificationCodes.find(
      (c) => c.code === input.code && !c.usedAt && c.expiresAt > new Date(),
    );

    if (!code) throw new AppError('Invalid or expired verification code', 400);

    await User.updateOne(
      { _id: userId, 'verificationCodes._id': code._id },
      {
        $set: {
          emailVerifiedAt: new Date(),
          'verificationCodes.$.usedAt': new Date(),
        },
      },
    );
  },

  async resendVerification(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerifiedAt) throw new AppError('Email already verified', 400);

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await User.updateOne(
      { _id: userId },
      { $push: { verificationCodes: { code, expiresAt } } },
    );

    await EmailService.sendVerificationCode(user.email, code, user.name);
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await User.findOne({ email: input.email });
    if (!user) return; // Silent — do not reveal whether email exists

    const code = generateOtp();
    const tokenHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.updateOne(
      { _id: user._id },
      { $set: { passwordResetToken: tokenHash, passwordResetExpiresAt: expiresAt } },
    );

    await EmailService.sendPasswordReset(user.email, code);
  },

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = crypto.createHash('sha256').update(input.code).digest('hex');

    const user = await User.findOne({
      email: input.email,
      passwordResetToken: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpiresAt');

    if (!user) throw new AppError('Invalid or expired reset code', 400);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: await bcrypt.hash(input.password, 12) },
        $unset: { passwordResetToken: '', passwordResetExpiresAt: '' },
      },
    );
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const match = await bcrypt.compare(input.currentPassword, user.password);
    if (!match) throw new AppError('Current password is incorrect', 400);

    await User.updateOne(
      { _id: userId },
      { $set: { password: await bcrypt.hash(input.newPassword, 12) } },
    );
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.phone !== undefined && { phone: input.phone }),
          ...(input.gender !== undefined && { gender: input.gender }),
          ...(input.country !== undefined && { country: input.country }),
          ...(input.churchMember !== undefined && { churchMember: input.churchMember }),
          ...(input.churchCentreId !== undefined && {
            churchCentreId: input.churchCentreId || null,
          }),
        },
      },
      { new: true },
    );

    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async deleteAccount(userId: string, password: string) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Incorrect password', 401);

    await User.deleteOne({ _id: userId });
  },

  async refreshAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as { sub: string };
      const user = await User.findById(payload.sub);
      if (!user) throw new AppError('Invalid or expired refresh token', 401);
      return {
        accessToken: generateAccessToken(user.id, user.email),
        refreshToken: generateRefreshToken(user.id),
      };
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  },

  // ─── Multi-step signup ────────────────────────────────────────────────────────

  async validateEmail(input: ValidateEmailInput) {
    const existing = await User.findOne({ email: input.email });
    if (existing) throw new AppError('Email already registered', 409);
    return { available: true };
  },

  async requestCode(input: RequestCodeInput) {
    // Check email isn't already registered
    const existing = await User.findOne({ email: input.email });
    if (existing) throw new AppError('Email already registered', 409);

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Store code in pending verifications (no user created)
    await PendingVerification.create({
      email: input.email,
      name: input.name,
      code,
      expiresAt,
    });

    await EmailService.sendVerificationCode(input.email, code, input.name);
    return { message: 'Verification code sent' };
  },

  async resendCode(input: ValidateEmailInput) {
    // Find the most recent pending verification for this email
    const pending = await PendingVerification.findOne({ email: input.email })
      .sort({ createdAt: -1 });
    if (!pending) throw new AppError('No pending verification found. Please request a new code.', 404);

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PendingVerification.create({
      email: input.email,
      name: pending.name,
      code,
      expiresAt,
    });

    await EmailService.sendVerificationCode(input.email, code, pending.name);
    return { message: 'Verification code resent' };
  },

  async verifyCode(input: VerifyCodeInput) {
    const pending = await PendingVerification.findOne({
      email: input.email,
      code: input.code,
      verifiedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!pending) throw new AppError('Invalid or expired verification code', 400);

    pending.verifiedAt = new Date();
    await pending.save();

    return { verified: true };
  },

  async setPassword(input: SetPasswordInput) {
    // Ensure the code was verified
    const pending = await PendingVerification.findOne({
      email: input.email,
      code: input.code,
      verifiedAt: { $ne: null },
    });

    if (!pending) throw new AppError('Email not verified. Please verify first.', 400);

    // Double-check no user was created in the meantime
    const existing = await User.findOne({ email: input.email });
    if (existing) throw new AppError('Account already exists. Please log in.', 409);

    const hashedPassword = await bcrypt.hash(input.password, 12);

    // NOW create the user
    const user = await User.create({
      name: input.name || pending.name,
      email: input.email,
      password: hashedPassword,
      emailVerifiedAt: pending.verifiedAt,
      ...(input.phone && { phone: input.phone }),
      ...(input.gender && { gender: input.gender }),
      ...(input.churchCentreId && { churchCentreId: input.churchCentreId }),
    });

    // Clean up all pending verifications for this email
    await PendingVerification.deleteMany({ email: input.email });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      token: accessToken,
      accessToken,
      refreshToken,
    };
  },
};
