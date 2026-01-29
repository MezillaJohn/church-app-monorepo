<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $events = Event::all();
        $sermons = \App\Models\Sermon::all();

        if ($events->isEmpty() && $sermons->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Create 5-10 notifications for each user
            $count = rand(5, 10);

            for ($i = 0; $i < $count; $i++) {
                // Randomly decide between Event (40%) or Sermon (60%)
                $isSermon = rand(0, 100) > 40 && $sermons->isNotEmpty();

                // Fallback if one collection is empty
                if ($isSermon && $sermons->isEmpty())
                    $isSermon = false;
                if (!$isSermon && $events->isEmpty())
                    $isSermon = true;

                $createdAt = now()->subDays(rand(0, 30));

                if ($isSermon) {
                    $sermon = $sermons->random();
                    $type = $sermon->type?->value ?? 'media'; // audio or video

                    DB::table('notifications')->insert([
                        'type' => 'App\Notifications\NewSermonNotification',
                        'notifiable_type' => User::class,
                        'notifiable_id' => $user->id,
                        'event_type' => \App\Models\Sermon::class,
                        'event_id' => $sermon->id,
                        'data' => json_encode([
                            'message' => "New {$type} available: {$sermon->title}",
                            'action_url' => "/sermons/{$sermon->id}"
                        ]),
                        'read_at' => rand(0, 1) ? now() : null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                } else {
                    $event = $events->random();

                    DB::table('notifications')->insert([
                        'type' => 'App\Notifications\EventNotification',
                        'notifiable_type' => User::class,
                        'notifiable_id' => $user->id,
                        'event_type' => Event::class,
                        'event_id' => $event->id,
                        'data' => json_encode([
                            'message' => "Reminder: {$event->title} is coming up soon!",
                            'action_url' => "/events/{$event->id}"
                        ]),
                        'read_at' => rand(0, 1) ? now() : null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                }
            }
        }
    }
}
