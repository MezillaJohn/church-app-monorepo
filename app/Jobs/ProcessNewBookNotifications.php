<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessNewBookNotifications implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $book) {}

    public function handle(PushNotificationService $pushNotificationService): void
    {
        User::chunk(100, function ($users) use ($pushNotificationService) {
            $notifications = [];
            $now = now();

            foreach ($users as $user) {
                $notifications[] = [
                    'type' => 'App\Notifications\NewBookNotification',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $user->id,
                    'event_type' => get_class($this->book),
                    'event_id' => $this->book->id,
                    'data' => json_encode([
                        'message' => 'New Book: '.$this->book->title,
                        'action_url' => '/books/'.$this->book->id,
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
                'New Book Available',
                $this->book->title,
                [
                    'type' => 'book',
                    'book_id' => $this->book->id,
                    'action_url' => '/books/'.$this->book->id,
                ]
            );
        });
    }
}
