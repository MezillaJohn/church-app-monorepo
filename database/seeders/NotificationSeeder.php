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
        $books = \App\Models\Book::all();

        if ($events->isEmpty() && $sermons->isEmpty() && $books->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Create 5-10 notifications for each user
            $count = rand(5, 10);

            for ($i = 0; $i < $count; $i++) {
                // Randomly distribute: 40% Sermon, 30% Event, 30% Book
                $rand = rand(0, 100);
                $isSermon = $rand > 60 && $sermons->isNotEmpty();
                $isBook = !$isSermon && $rand > 30 && $books->isNotEmpty();
                $isEvent = !$isSermon && !$isBook && $events->isNotEmpty();

                // Fallbacks
                if ($isSermon && $sermons->isEmpty()) {
                    $isSermon = false;
                    $isBook = true;
                }
                if ($isBook && $books->isEmpty()) {
                    $isBook = false;
                    $isEvent = true;
                }
                if ($isEvent && $events->isEmpty()) {
                    $isEvent = false;
                    $isSermon = true;
                } // Try loop back

                $createdAt = now()->subDays(rand(0, 30));

                if ($isBook) {
                    $book = $books->random();
                    DB::table('notifications')->insert([
                        'type' => 'App\Notifications\NewBookNotification',
                        'notifiable_type' => User::class,
                        'notifiable_id' => $user->id,
                        'event_type' => \App\Models\Book::class,
                        'event_id' => $book->id,
                        'data' => json_encode([
                            'message' => "New Book: {$book->title}",
                            'action_url' => "/books/{$book->id}"
                        ]),
                        'read_at' => rand(0, 1) ? now() : null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                } elseif ($isSermon) {
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
