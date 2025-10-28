<?php

namespace App\Models;

use App\Enums\DonationType;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'donation_type',
        'payment_method',
        'payment_gateway',
        'transaction_reference',
        'status',
        'note',
        'is_anonymous',
        'proof_of_payment',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'donation_type' => DonationType::class,
        'payment_method' => PaymentMethod::class,
        'is_anonymous' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
