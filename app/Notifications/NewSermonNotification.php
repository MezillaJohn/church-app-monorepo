<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewSermonNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public $sermon) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'New Sermon: '.$this->sermon->title,
            'action_url' => '/sermons/'.$this->sermon->id,
            // Additional data handled by custom db columns (event_type/id) via logic we'll add to DB channel or manually if needed.
            // Wait, standard Database channel puts this in `data`.
            // Our custom table has `event_type` and `event_id`.
            // The standard DatabaseChannel::buildPayload uses toArray/toDatabase.
            // We need to ensure event_type/id are set.
            // Since we stuck to standard DatabaseNotification, we rely on the `data` column.
            // BUT our migration ADDED those columns. We need to populate them.
            // Standard channel won't populate custom columns.
            // We should use a custom channel OR just let the Observer create the notification manually?
            // Actually, the Observer logic I planned was to "Dispatch NewSermonNotification".
            // If we use Notification::send(), Laravel handles it.
            // To fill custom columns, we might need a custom channel or just manual creation in Observer.
            // Given the requirement for custom columns, manual creation in Observer is safer/easier than extending DatabaseChannel.
            // Let's stick to using the Notification class for structure, but Observer might manually insert OR we override toDatabase...
            // no, toDatabase returns array for `data` column.
            // Let's make this class useful for `data` content.
        ];
    }
}
