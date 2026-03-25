import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema,
  validateEmailSchema,
  requestCodeSchema,
  verifyCodeSchema,
  setPasswordSchema,
} from './auth.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post('/reset-password', validate({ body: resetPasswordSchema }), AuthController.resetPassword);
router.post('/refresh-token', validate({ body: refreshTokenSchema }), AuthController.refreshToken);

// ─── Multi-step signup (public) ──────────────────────────────────────────────
router.post('/validate-email', validate({ body: validateEmailSchema }), AuthController.validateEmail);
router.post('/register/request-code', validate({ body: requestCodeSchema }), AuthController.requestCode);
router.post('/register/resend-code', validate({ body: validateEmailSchema }), AuthController.resendCode);
router.post('/register/verify-code', validate({ body: verifyCodeSchema }), AuthController.verifyCode);
router.post('/register/set-password', validate({ body: setPasswordSchema }), AuthController.setPassword);

// ─── Authenticated (email not yet required to be verified) ───────────────────
router.post('/email/verify', authenticate, validate({ body: verifyEmailSchema }), AuthController.verifyEmail);
router.post('/email/resend', authenticate, AuthController.resendVerification);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.use(authenticate, requireVerified);
router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.profile);
router.put('/profile', validate({ body: updateProfileSchema }), AuthController.updateProfile);
router.post('/change-password', validate({ body: changePasswordSchema }), AuthController.changePassword);
router.delete('/account', AuthController.deleteAccount);

export default router;
