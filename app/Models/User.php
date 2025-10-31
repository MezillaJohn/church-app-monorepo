<?php

namespace App\Models;

use App\Http\Filters\QueryFilter;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'church_centre',
        'country',
        'phone',
        'gender',
        'church_member',
        'email_verification_code',
        'code_expires_at',
        'code_sent_at',
        'password_reset_code',
        'reset_code_expires_at',
        'reset_code_sent_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'church_member' => 'boolean',
            'code_expires_at' => 'datetime',
            'code_sent_at' => 'datetime',
            'reset_code_expires_at' => 'datetime',
            'reset_code_sent_at' => 'datetime',
        ];
    }
    public function scopeFilter(Builder $builder, QueryFilter $filters)
    {
        return $filters->apply($builder);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function watchLater(): HasMany
    {
        return $this->hasMany(WatchLater::class);
    }

    public function bookPurchases(): HasMany
    {
        return $this->hasMany(BookPurchase::class);
    }

    public function bookRatings(): HasMany
    {
        return $this->hasMany(BookRating::class);
    }

    public function eventRsvps(): HasMany
    {
        return $this->hasMany(EventRsvp::class);
    }

    public function eventReminders(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }

    public function pushTokens(): HasMany
    {
        return $this->hasMany(PushToken::class);
    }

    public function sermonProgress(): HasMany
    {
        return $this->hasMany(SermonProgress::class);
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        // TODO: Implement proper role check using Spatie Permission
        // return $this->hasRole('admin');
        return false; // Placeholder - configure roles in Filament
    }

    /**
     * Generate a 6-digit verification code
     */
    public function generateVerificationCode(): string
    {
        $this->email_verification_code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->code_expires_at = now()->addMinutes(10);
        $this->code_sent_at = now();
        $this->save();
        return $this->email_verification_code;
    }

    /**
     * Check if verification code has expired
     */
    public function isCodeExpired(): bool
    {
        return $this->code_expires_at && $this->code_expires_at->isPast();
    }

    /**
     * Check if user can resend verification code (60 second throttle)
     */
    public function canResendCode(): bool
    {
        if (!$this->code_sent_at) {
            return true;
        }

        return $this->code_sent_at->addSeconds(60)->isPast();
    }

    /**
     * Clear verification code
     */
    public function clearVerificationCode(): void
    {
        $this->email_verification_code = null;
        $this->code_expires_at = null;
        $this->code_sent_at = null;
        $this->save();
    }

    /**
     * Generate a 6-digit password reset code
     */
    public function generatePasswordResetCode(): string
    {
        $this->password_reset_code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->reset_code_expires_at = now()->addMinutes(10);
        $this->reset_code_sent_at = now();
        $this->save();
        return $this->password_reset_code;
    }

    /**
     * Check if password reset code has expired
     */
    public function isResetCodeExpired(): bool
    {
        return $this->reset_code_expires_at && $this->reset_code_expires_at->isPast();
    }

    /**
     * Check if user can resend password reset code (60 second throttle)
     */
    public function canResendResetCode(): bool
    {
        if (!$this->reset_code_sent_at) {
            return true;
        }

        return $this->reset_code_sent_at->addSeconds(60)->isPast();
    }

    /**
     * Clear password reset code
     */
    public function clearPasswordResetCode(): void
    {
        $this->password_reset_code = null;
        $this->reset_code_expires_at = null;
        $this->reset_code_sent_at = null;
        $this->save();
    }

    /**
     * Check if user profile is complete
     */
    public function getProfileCompleteAttribute(): bool
    {
        return !empty($this->church_centre)
            && !empty($this->country)
            && !empty($this->phone)
            && !empty($this->gender)
            && $this->church_member !== null;
    }
}
