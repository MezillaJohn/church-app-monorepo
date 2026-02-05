<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessNewSermonNotifications implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $sermon) {}

    public function handle(PushNotificationService $pushNotificationService): void
    {
        // Get all users in chunks
        User::chunk(100, function ($users) use ($pushNotificationService) {
            $notifications = [];
            $now = now();

            foreach ($users as $user) {
                $notifications[] = [
                    'type' => 'App\Notifications\NewSermonNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'event_type' => get_class($this->sermon),
                    'event_id' => $this->sermon->id,
                    'data' => json_encode([
                        'message' => 'New Sermon: '.$this->sermon->title,
                        'action_url' => '/sermons/'.$this->sermon->id,
                    ]),
                    'read_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // Bulk insert database notifications
            if (! empty($notifications)) {
                DB::table('notifications')->insert($notifications);
            }

            // Send push notifications to this chunk of users
            $pushNotificationService->sendToUsers(
                $users,
                'New Sermon Available',
                $this->sermon->title,
                [
                    'type' => 'sermon',
                    'sermon_id' => $this->sermon->id,
                    'action_url' => '/sermons/'.$this->sermon->id,
                ]
            );
        });
    }
}
