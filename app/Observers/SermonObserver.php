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
        $this->checkAndNotify($sermon);
    }

    public function updated(Sermon $sermon): void
    {
        // If audio or video was just added/changed
        if ($sermon->wasChanged(['audio_file_url', 'youtube_video_id', 'youtube_video_url'])) {
            $this->checkAndNotify($sermon);
        }
    }

    protected function checkAndNotify(Sermon $sermon): void
    {
        // Check if media exists
        $hasMedia = !empty($sermon->audio_file_url) || !empty($sermon->youtube_video_id) || !empty($sermon->youtube_video_url);

        if ($hasMedia && $sermon->is_published) {
            // We need to notify all users. BATCHING this is important for performance.
            // For now, we'll implement a chunked loop. In production, this should be a Job.
            // I will dispatch a job here.

            // First, let's just create the code to create notifications.
            // Since we have custom columns (event_type, event_id), standard Notification::send() won't fill them easily.
            // We will manually insert or use a custom method.
            // Manual insertion is most performant for bulk.

            \App\Jobs\ProcessNewSermonNotifications::dispatch($sermon);
        }
    }
}
