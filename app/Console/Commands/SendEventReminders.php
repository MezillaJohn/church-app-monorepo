<?php

namespace App\Console\Commands;

use App\Models\EventReminder;
use App\Services\PushNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-event-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send push notifications for event reminders that are due';

    /**
     * Execute the console command.
     */
    public function handle(PushNotificationService $pushNotificationService): int
    {
        $this->info('Sending event reminders...');

        // Query reminders that are due (within 5 minute grace period)
        $reminders = EventReminder::where('is_sent', false)
            ->where('reminder_time', '<=', now())
            ->where('reminder_time', '>=', now()->subMinutes(5))
            ->with(['user', 'event'])
            ->get();

        if ($reminders->isEmpty()) {
            $this->info('No reminders to send.');
            return Command::SUCCESS;
        }

        $sent = 0;
        $failed = 0;

        foreach ($reminders as $reminder) {
            try {
                if (!$reminder->user || !$reminder->event) {
                    $this->warn("Skipping reminder {$reminder->id}: missing user or event");
                    $failed++;
                    continue;
                }

                $eventTitle = $reminder->event->title;
                $eventDate = \Carbon\Carbon::parse($reminder->event->event_date)->format('M d, Y');
                $eventTime = \Carbon\Carbon::parse($reminder->event->event_time)->format('g:i A');

                $title = 'Event Reminder';
                $body = "{$eventTitle} is coming up on {$eventDate} at {$eventTime}";
                $data = [
                    'type' => 'event_reminder',
                    'event_id' => $reminder->event->id,
                    'reminder_id' => $reminder->id,
                ];

                $result = $pushNotificationService->sendToUser(
                    $reminder->user,
                    $title,
                    $body,
                    $data
                );

                if (!empty($result) && isset($result[0]['success']) && $result[0]['success']) {
                    $reminder->update(['is_sent' => true]);
                    $sent++;
                    $this->info("Sent reminder {$reminder->id} to user {$reminder->user->id}");
                } else {
                    $failed++;
                    $this->error("Failed to send reminder {$reminder->id}");
                    Log::warning("Failed to send event reminder", [
                        'reminder_id' => $reminder->id,
                        'user_id' => $reminder->user_id,
                        'result' => $result,
                    ]);
                }
            } catch (\Exception $e) {
                $failed++;
                $this->error("Error sending reminder {$reminder->id}: {$e->getMessage()}");
                Log::error("Error sending event reminder", [
                    'reminder_id' => $reminder->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        $this->info("Completed: {$sent} sent, {$failed} failed");

        return Command::SUCCESS;
    }
}
