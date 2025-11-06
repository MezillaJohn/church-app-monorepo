<?php

namespace App\Console\Commands;

use App\Models\EventReminder;
use App\Notifications\EventReminderNotification;
use App\Services\PushNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

                // Get reminder setting for text
                $reminderTimeText = 'at event time';
                if ($reminder->reminderSetting) {
                    $reminderTimeText = $reminder->reminderSetting->name;
                }

                $pushSent = false;
                $emailSent = false;

                // Send push notification
                try {
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
                        $pushSent = true;
                        $reminder->update(['notification_sent_at' => now()]);
                        $this->info("Sent push notification for reminder {$reminder->id}");
                    }
                } catch (\Exception $e) {
                    Log::warning("Failed to send push notification for reminder {$reminder->id}", [
                        'error' => $e->getMessage(),
                    ]);
                }

                // Send email notification
                try {
                    $reminder->user->notify(new EventReminderNotification(
                        $reminder->event,
                        $reminderTimeText
                    ));
                    $emailSent = true;
                    $reminder->update(['email_sent_at' => now()]);
                    $this->info("Sent email notification for reminder {$reminder->id}");
                } catch (\Exception $e) {
                    Log::warning("Failed to send email notification for reminder {$reminder->id}", [
                        'error' => $e->getMessage(),
                    ]);
                }

                // Mark as sent if at least one notification was successful
                if ($pushSent || $emailSent) {
                    $reminder->update(['is_sent' => true]);
                    $sent++;
                } else {
                    $failed++;
                    $this->error("Failed to send reminder {$reminder->id}");
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
