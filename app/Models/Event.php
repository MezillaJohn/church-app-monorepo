<?php

namespace App\Models;

use App\Enums\EventType;
use App\Enums\RecurrencePattern;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'event_date',
        'event_time',
        'location',
        'event_type',
        'image_url',
        'max_attendees',
        'requires_rsvp',
        'is_published',
        'is_recurring',
        'recurrence_pattern',
        'recurrence_interval',
        'recurrence_end_date',
        'recurrence_count',
        'parent_event_id',
    ];

    protected $casts = [
        'event_type' => EventType::class,
        'event_date' => 'date',
        'event_time' => 'datetime:H:i',
        'requires_rsvp' => 'boolean',
        'is_published' => 'boolean',
        'is_recurring' => 'boolean',
        'recurrence_pattern' => RecurrencePattern::class,
        'recurrence_interval' => 'integer',
        'recurrence_end_date' => 'date',
        'recurrence_count' => 'integer',
    ];

    public function rsvps(): HasMany
    {
        return $this->hasMany(EventRsvp::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }

    /**
     * Get the parent event if this is a recurring instance
     */
    public function parentEvent(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'parent_event_id');
    }

    /**
     * Get recurring instances of this event
     */
    public function recurringInstances(): HasMany
    {
        return $this->hasMany(Event::class, 'parent_event_id');
    }

    /**
     * Scope to filter recurring events
     */
    public function scopeRecurring(Builder $query): Builder
    {
        return $query->where('is_recurring', true);
    }

    /**
     * Scope to filter non-recurring events
     */
    public function scopeNonRecurring(Builder $query): Builder
    {
        return $query->where('is_recurring', false);
    }
}
