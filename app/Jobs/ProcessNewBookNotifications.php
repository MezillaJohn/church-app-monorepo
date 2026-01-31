<?php

namespace App\Jobs;

use App\Models\User;
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

    public function handle(): void
    {
        User::chunk(100, function ($users) {
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

            if (! empty($notifications)) {
                DB::table('notifications')->insert($notifications);
            }
        });
    }
}
