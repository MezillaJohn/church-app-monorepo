<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventReminder extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'reminder_setting_id',
        'reminder_time',
        'is_sent',
        'notification_sent_at',
        'email_sent_at',
    ];

    protected $casts = [
        'reminder_time' => 'datetime',
        'is_sent' => 'boolean',
        'notification_sent_at' => 'datetime',
        'email_sent_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function reminderSetting(): BelongsTo
    {
        return $this->belongsTo(EventReminderSetting::class);
    }
}
