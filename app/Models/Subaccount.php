<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subaccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'creation_method',
        'business_name',
        'paystack_subaccount_code',
        'settlement_bank',
        'account_number',
        'percentage_charge',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function donationTypes(): HasMany
    {
        return $this->hasMany(DonationType::class);
    }
}
