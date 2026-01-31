<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmail;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Mail;

class AuthController extends BaseController
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());

            // Send verification email with code
            Mail::to($user)->send(new VerifyEmail($user, $user->email_verification_code));

            $token = $user->createToken('api-token')->plainTextToken;

            return $this->ok('User registered successfully. Please verify your email.', [
                'token' => $token,
                'user' => new UserResource($user),
            ]);
        } catch (\Exception $e) {
            return $this->error('Registration failed', ['exception' => $e->getMessage()], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (! $result) {
            return $this->error('Invalid credentials', [], 401);
        }

        // Return token and user resource
        return $this->ok('Login successful', [
            'token' => $result['token'] ?? null,
            'user' => new UserResource($result['user'] ?? $result),
        ]);
    }

    public function validateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $emailExists = User::where('email', $request->email)->exists();
        if ($emailExists) {
            return $this->error('Email already exists', [], 400);
        }

        return $this->ok('Email is available');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->ok('Logged out successfully');
    }

    public function profile(Request $request)
    {
        return $this->ok('Profile retrieved successfully', new UserResource($request->user()->load('churchCentre')));
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            $user = $this->authService->updateProfile($request->user(), $request->validated());

            return $this->ok('Profile updated successfully', new UserResource($user));
        } catch (\Exception $e) {
            return $this->error('Failed to update profile', ['exception' => $e->getMessage()], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        $changed = $this->authService->changePassword(
            $request->user(),
            $request->current_password,
            $request->new_password
        );

        if (! $changed) {
            return $this->error('Current password is incorrect', [], 422);
        }

        return $this->ok('Password changed successfully');
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return $this->ok('Email already verified');
        }

        // Check if code matches
        if ($user->email_verification_code !== $request->code) {
            return $this->error('Invalid verification code', [], 400);
        }

        // Check if code has expired
        if ($user->isCodeExpired()) {
            return $this->error('Verification code has expired. Please request a new one.', [], 400);
        }

        // Mark as verified
        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        // Clear verification code (single-use)
        $user->clearVerificationCode();

        return $this->ok('Email verified successfully');
    }

    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->error('Email already verified', [], 400);
        }

        try {
            // Generate new code (invalidates old one)
            $code = $this->authService->resendVerificationCode($user);

            // Send verification email
            Mail::to($user)->send(new VerifyEmail($user, $code));

            return $this->ok('Verification email sent'); // For testing/development
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), [], 429);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $result = $this->authService->initiatePasswordReset($request->email);

            if (! $result) {
                // Always return success message for security (don't reveal if email exists)
                return $this->ok('If the email exists, a password reset code has been sent');
            }

            $user = $result['user'];
            $code = $result['code'];

            // Send email with code
            Mail::to($user)->send(new ResetPasswordMail($user, $code));

            // Always return success message (don't reveal if email exists)
            return $this->ok('If the email exists, a password reset code has been sent', [
                // 'reset_code' => $code, // For testing/development
            ]);
        } catch (\Exception $e) {
            // Always return success for security
            return $this->ok('If the email exists, a password reset code has been sent');
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|min:8|confirmed',
        ]);

        $success = $this->authService->resetPasswordWithCode(
            $request->email,
            $request->code,
            $request->password
        );

        if (! $success) {
            return $this->error('Invalid or expired reset code. Please request a new one.', [], 400);
        }

        return $this->ok('Password reset successfully');
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        $deleted = $this->authService->deleteAccount($user, $request->password);

        if (! $deleted) {
            return $this->error('Invalid password. Please try again.', [], 422);
        }

        return $this->ok('Account deleted successfully');
    }
}
