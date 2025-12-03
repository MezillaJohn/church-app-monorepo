<?php

namespace App\Models;

use App\Enums\PartnershipInterval;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partnership extends Model
{
    protected $fillable = [
        'fullname',
        'phone_no',
        'email',
        'partnership_type_id',
        'user_id',
        'interval',
        'amount',
        'currency',
    ];

    protected $casts = [
        'interval' => PartnershipInterval::class,
        'amount' => 'decimal:2',
    ];

    public function partnershipType(): BelongsTo
    {
        return $this->belongsTo(PartnershipType::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
