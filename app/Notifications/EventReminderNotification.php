<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Event $event,
        public string $reminderTimeText
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Event Reminder: ' . $this->event->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a reminder for the upcoming event: ' . $this->event->title)
            ->line('Event Date: ' . $this->event->event_date->format('l, F d, Y'))
            ->line('Event Time: ' . \Carbon\Carbon::parse($this->event->event_time)->format('g:i A'))
            ->line('Location: ' . $this->event->location)
            ->line('Reminder: ' . $this->reminderTimeText)
            ->action('View Event Details', url('/events/' . $this->event->id))
            ->line('We look forward to seeing you there!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'event_reminder',
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'event_date' => $this->event->event_date->toDateString(),
            'event_time' => \Carbon\Carbon::parse($this->event->event_time)->format('H:i'),
            'location' => $this->event->location,
            'reminder_text' => $this->reminderTimeText,
        ];
    }
}
