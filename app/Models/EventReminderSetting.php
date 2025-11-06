<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventReminderSetting extends Model
{
    protected $fillable = [
        'name',
        'minutes_before',
        'is_active',
    ];

    protected $casts = [
        'minutes_before' => 'integer',
        'is_active' => 'boolean',
    ];

    public function eventReminders(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }
}
