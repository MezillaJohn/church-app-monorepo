import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../shared/utils/api-response';
import { catchAsync } from '../../shared/utils/catch-async';

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);
    return ApiResponse.created(res, user, 'Registration successful. Please verify your email.');
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    return ApiResponse.success(res, result, 'Login successful');
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    await AuthService.verifyEmail(req.user!.id, req.body);
    return ApiResponse.success(res, null, 'Email verified successfully');
  }),

  resendVerification: catchAsync(async (req: Request, res: Response) => {
    await AuthService.resendVerification(req.user!.id);
    return ApiResponse.success(res, null, 'Verification code sent');
  }),

  forgotPassword: catchAsync(async (req: Request, res: Response) => {
    await AuthService.forgotPassword(req.body);
    return ApiResponse.success(res, null, 'If that email exists, a reset link has been sent');
  }),

  resetPassword: catchAsync(async (req: Request, res: Response) => {
    await AuthService.resetPassword(req.body);
    return ApiResponse.success(res, null, 'Password reset successful');
  }),

  profile: catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.getProfile(req.user!.id);
    return ApiResponse.success(res, user);
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.updateProfile(req.user!.id, req.body);
    return ApiResponse.success(res, user, 'Profile updated');
  }),

  changePassword: catchAsync(async (req: Request, res: Response) => {
    await AuthService.changePassword(req.user!.id, req.body);
    return ApiResponse.success(res, null, 'Password changed');
  }),

  deleteAccount: catchAsync(async (req: Request, res: Response) => {
    await AuthService.deleteAccount(req.user!.id);
    return ApiResponse.noContent(res);
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    // JWT is stateless — client discards token.
    // For token blacklisting add a Redis-based denylist here.
    return ApiResponse.success(res, null, 'Logged out successfully');
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.refreshAccessToken(req.body.refreshToken);
    return ApiResponse.success(res, result);
  }),

  // ─── Multi-step signup ────────────────────────────────────────────────────────

  validateEmail: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.validateEmail(req.body);
    return ApiResponse.success(res, result, 'Email is available');
  }),

  resendCode: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.resendCode(req.body);
    return ApiResponse.success(res, result, 'Verification code resent');
  }),

  requestCode: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.requestCode(req.body);
    return ApiResponse.success(res, result, 'Verification code sent to your email');
  }),

  verifyCode: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.verifyCode(req.body);
    return ApiResponse.success(res, result, 'Email verified successfully');
  }),

  setPassword: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.setPassword(req.body);
    return ApiResponse.created(res, result, 'Account created successfully');
  }),
};
