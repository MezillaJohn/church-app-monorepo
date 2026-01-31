<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SermonSeries extends Model
{
    protected $fillable = [
        'name',
        'description',
        'slug',
        'preacher',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all sermons in this series
     */
    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'series_id');
    }

    /**
     * Scope to filter active series
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
