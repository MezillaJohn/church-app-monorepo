<?php

namespace App\Models;

use App\Enums\EventType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    ];

    protected $casts = [
        'event_type' => EventType::class,
        'event_date' => 'date',
        'event_time' => 'datetime:H:i',
        'requires_rsvp' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function rsvps(): HasMany
    {
        return $this->hasMany(EventRsvp::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }
}
