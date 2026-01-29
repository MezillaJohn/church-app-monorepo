<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Generate verification code
        $verificationCode = $user->generateVerificationCode();

        return $user;
    }

    public function login(array $credentials): ?array
    {
        if (!auth()->attempt($credentials)) {
            return null;
        }

        $user = auth()->user();
        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->pushTokens()->delete();
        $user->tokens()->delete();
    }

    public function updateProfile(User $user, array $data): User
    {
        $payload = [
            'country' => $data['country'] ?? $user->country,
            'phone' => $data['phone'] ?? $user->phone,
            'gender' => $data['gender'] ?? $user->gender,
            'church_member' => $data['church_member'] ?? $user->church_member,
        ];

        if (array_key_exists('church_centre', $data)) {
            $payload['church_centre_id'] = $data['church_centre'];
        }

        $user->update($payload);

        return $user->fresh('churchCentre');
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        return true;
    }

    public function resendVerificationCode(User $user): string
    {
        if (!$user->canResendCode()) {
            throw new \Exception('Please wait 60 seconds before requesting a new code.');
        }

        // Generate new code (invalidates old one)
        return $user->generateVerificationCode();
    }

    public function initiatePasswordReset(string $email): ?array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return null; // Don't reveal if email exists
        }

        // Check throttle
        if (!$user->canResendResetCode()) {
            throw new \Exception('Please wait 60 seconds before requesting a new code.');
        }

        // Generate code (invalidates old one)
        $code = $user->generatePasswordResetCode();

        return [
            'user' => $user,
            'code' => $code,
        ];
    }

    public function resetPasswordWithCode(string $email, string $code, string $newPassword): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return false;
        }

        // Check if code matches
        if ($user->password_reset_code !== $code) {
            return false;
        }

        // Check if code has expired
        if ($user->isResetCodeExpired()) {
            return false;
        }

        // Reset password
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        // Clear reset code (single-use)
        $user->clearPasswordResetCode();

        // Invalidate all tokens
        $user->tokens()->delete();

        return true;
    }

    /**
     * Delete user account
     * 
     * @param User $user
     * @param string $password
     * @return bool
     */
    public function deleteAccount(User $user, string $password): bool
    {
        // Verify password before deletion
        if (!Hash::check($password, $user->password)) {
            return false;
        }

        // Delete all user tokens
        $user->tokens()->delete();

        // Delete the user account (related data will be handled by cascade or model events)
        $user->delete();

        return true;
    }
}

