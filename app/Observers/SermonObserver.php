<?php

namespace App\Observers;

use App\Models\Sermon;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Support\Facades\Log;

class SermonObserver
{
    public function __construct(private ?PushNotificationService $pushNotificationService = null)
    {
    }

    /**
     * Handle the Sermon "created" event.
     */
    public function created(Sermon $sermon): void
    {
        // Only send notification if sermon is published
        if ($sermon->is_published && $this->pushNotificationService) {
            $this->sendNewSermonNotification($sermon);
        }
    }

    /**
     * Handle the Sermon "updated" event.
     */
    public function updated(Sermon $sermon): void
    {
        // Send notification if sermon was just published
        if ($sermon->is_published && $sermon->wasChanged('is_published') && $this->pushNotificationService) {
            $this->sendNewSermonNotification($sermon);
        }
    }

    /**
     * Send notification to all users about new sermon
     */
    protected function sendNewSermonNotification(Sermon $sermon): void
    {
        try {
            // Get all users who have push tokens
            $users = User::whereHas('pushTokens', function ($query) {
                $query->where('is_active', true);
            })->get();

            if ($users->isEmpty()) {
                return;
            }

            $this->pushNotificationService->sendToUsers(
                $users,
                'New Sermon Available',
                $sermon->title,
                [
                    'type' => 'sermon',
                    'id' => $sermon->id,
                ]
            );
        } catch (\Exception $e) {
            Log::error('Failed to send new sermon notification', [
                'error' => $e->getMessage(),
                'sermon_id' => $sermon->id,
            ]);
        }
    }
}
