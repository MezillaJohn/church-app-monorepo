<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookPurchase extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'price_paid',
        'transaction_reference',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'price_paid' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
