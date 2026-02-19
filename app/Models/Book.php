<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'price',
        'cover_image',
        'file_url',
        'preview_pages',
        'category_id',
        'average_rating',
        'ratings_count',
        'purchases_count',
        'is_featured',
        'is_published',
        'subaccount_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subaccount(): BelongsTo
    {
        return $this->belongsTo(Subaccount::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(BookRating::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(BookPurchase::class);
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'book_purchases')
            ->withPivot(['price_paid', 'transaction_reference', 'payment_method', 'status', 'created_at']);
    }
}
