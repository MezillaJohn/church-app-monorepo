<?php

namespace App\Models;

use App\Enums\SermonType;
use App\Http\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sermon extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'speaker',
        'date',
        'audio_file_url',
        'youtube_video_id',
        'youtube_video_url',
        'thumbnail_url',
        'duration',
        'category_id',
        'series',
        'views',
        'favorites_count',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'type' => SermonType::class,
        'date' => 'date',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function scopeFilter(Builder $builder, QueryFilter $filters)
    {
        return $filters->apply($builder);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function watchLater(): HasMany
    {
        return $this->hasMany(WatchLater::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(SermonProgress::class);
    }

    public function userProgress(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'sermon_progress')
            ->withPivot(['progress', 'is_completed', 'updated_at']);
    }
}
