<?php

namespace App\Models;

use App\Enums\EventType;
use App\Enums\RecurrencePattern;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

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
        'broadcast_url',
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

    /**
     * Check if event is currently live
     * Live window: 5 minutes before start time to 30 minutes after start time
     */
    public function isLive(): bool
    {
        if (!$this->event_date || !$this->event_time) {
            return false;
        }

        $eventDate = Carbon::parse($this->event_date);
        $eventTime = Carbon::parse($this->event_time);
        $eventDateTime = Carbon::create(
            $eventDate->year,
            $eventDate->month,
            $eventDate->day,
            $eventTime->hour,
            $eventTime->minute,
            0
        );

        $liveStart = $eventDateTime->copy()->subMinutes(5);
        $liveEnd = $eventDateTime->copy()->addMinutes(30);
        $now = Carbon::now();

        return $now->gte($liveStart) && $now->lte($liveEnd);
    }

    /**
     * Get the next closest upcoming event by date/time
     */
    public static function getNextLiveEvent(): ?Event
    {
        $now = Carbon::now();

        return static::where('is_published', true)
            ->whereNull('parent_event_id')
            ->get()
            ->filter(function ($event) use ($now) {
                if (!$event->event_date || !$event->event_time) {
                    return false;
                }

                $eventDate = Carbon::parse($event->event_date);
                $eventTime = Carbon::parse($event->event_time);
                $eventDateTime = Carbon::create(
                    $eventDate->year,
                    $eventDate->month,
                    $eventDate->day,
                    $eventTime->hour,
                    $eventTime->minute,
                    0
                );

                return $eventDateTime->gte($now);
            })
            ->sortBy(function ($event) {
                $eventDate = Carbon::parse($event->event_date);
                $eventTime = Carbon::parse($event->event_time);
                $eventDateTime = Carbon::create(
                    $eventDate->year,
                    $eventDate->month,
                    $eventDate->day,
                    $eventTime->hour,
                    $eventTime->minute,
                    0
                );
                return $eventDateTime->timestamp;
            })
            ->first();
    }
}
