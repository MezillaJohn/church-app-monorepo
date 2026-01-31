<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Requests\Api\V1\Auth\RequestCodeRequest;
use App\Http\Requests\Api\V1\Auth\ResendCodeRequest;
use App\Http\Requests\Api\V1\Auth\SetPasswordRequest;
use App\Http\Requests\Api\V1\Auth\VerifyCodeRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Mail\VerificationCodeMail;
use App\Models\User;
use App\Models\VerificationCode;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegistrationController extends BaseController
{
    use ApiResponse;

    public function requestCode(RequestCodeRequest $request)
    {
        $email = strtolower(trim($request->input('email')));
        $name = trim($request->input('name'));

        // If user already exists and verified, block
        if (User::where('email', $email)->exists()) {
            return $this->error('Email is already registered', [], 422);
        }

        $cooldown = (int) config('verification.resend_cooldown_seconds');
        $existing = VerificationCode::where('email', $email)->latest()->first();
        if ($existing && $existing->last_sent_at) {
            $nextAllowedAt = $existing->last_sent_at->copy()->addSeconds($cooldown);
            if ($nextAllowedAt->isFuture()) {
                $secondsRemaining = now()->diffInSeconds($nextAllowedAt);

                return $this->error(
                    'Please wait before requesting another code',
                    [
                        'wait_seconds' => $secondsRemaining,
                        'available_at' => $nextAllowedAt->toIso8601String(),
                    ],
                    429
                );
            }
        }

        $codeLength = (int) config('verification.code_length', 4);
        $code = str_pad((string) random_int(0, (10 ** $codeLength) - 1), $codeLength, '0', STR_PAD_LEFT);

        $record = VerificationCode::create([
            'email' => $email,
            'name' => $name,
            'code' => $code,
            'expires_at' => now()->addMinutes((int) config('verification.code_ttl_minutes', 15)),
            'last_sent_at' => now(),
        ]);

        Mail::to($email)->send(new VerificationCodeMail($name, $code));

        return $this->ok('Verification code sent');
    }

    public function resendCode(ResendCodeRequest $request)
    {
        $email = strtolower(trim($request->input('email')));
        $existing = VerificationCode::where('email', $email)->active()->latest()->first();
        if (! $existing) {
            return $this->error('No active verification request found. Please request a new code.', [], 404);
        }

        $cooldown = (int) config('verification.resend_cooldown_seconds');
        if ($existing->last_sent_at) {
            $nextAllowedAt = $existing->last_sent_at->copy()->addSeconds($cooldown);
            if ($nextAllowedAt->isFuture()) {
                $secondsRemaining = now()->diffInSeconds($nextAllowedAt);

                return $this->error(
                    'Please wait before requesting another code',
                    [
                        'wait_seconds' => $secondsRemaining,
                        'available_at' => $nextAllowedAt->toIso8601String(),
                    ],
                    429
                );
            }
        }

        $existing->update(['last_sent_at' => now()]);
        Mail::to($email)->send(new VerificationCodeMail($existing->name ?? '', $existing->code));

        return $this->ok('Verification code resent');
    }

    public function verifyCode(VerifyCodeRequest $request)
    {
        $email = strtolower(trim($request->input('email')));
        $code = $request->input('code');

        $maxAttempts = (int) config('verification.max_attempts', 5);

        $record = VerificationCode::where('email', $email)
            ->active()
            ->latest()
            ->first();

        if (! $record) {
            return $this->error('Invalid or expired code', [], 422);
        }

        if ($record->attempts >= $maxAttempts) {
            return $this->error('Too many attempts. Request a new code.', [], 429);
        }

        if ($record->code !== $code) {
            $record->increment('attempts');

            return $this->error('Invalid code', [], 422);
        }

        // Generate proceed token
        $proceedToken = Str::random(64);
        $record->proceed_token_hash = Hash::make($proceedToken);
        $record->proceed_token_expires_at = now()->addMinutes((int) config('verification.proceed_token_ttl_minutes', 15));
        $record->save();

        return $this->ok('Code verified', [
            'proceed_token' => $proceedToken,
            'email' => $email,
            'name' => $record->name,
        ]);
    }

    public function setPassword(SetPasswordRequest $request)
    {
        $email = strtolower(trim($request->input('email')));
        $password = $request->input('password');
        $proceedToken = $request->input('proceed_token');

        $record = VerificationCode::where('email', $email)
            ->whereNotNull('proceed_token_hash')
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (! $record || ! $record->proceed_token_expires_at || $record->proceed_token_expires_at->isPast()) {
            return $this->error('Invalid or expired proceed token', [], 422);
        }

        if (! Hash::check($proceedToken, (string) $record->proceed_token_hash)) {
            return $this->error('Invalid proceed token', [], 422);
        }

        if (User::where('email', $email)->exists()) {
            return $this->error('Email is already registered', [], 422);
        }

        return DB::transaction(function () use ($record, $email, $password) {
            $user = new User;
            $user->name = $record->name ?? '';
            $user->email = $email;
            $user->password = Hash::make($password);
            $user->email_verified_at = now();
            $user->save();

            // Mark code as used
            $record->markUsed();

            $token = $user->createToken('api')->plainTextToken;

            return $this->ok('Registration completed', [
                'token' => $token,
                'user' => new UserResource($user),
            ], 201);
        });
    }
}
