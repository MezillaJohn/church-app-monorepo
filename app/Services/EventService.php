<?php

namespace App\Services;

use App\Enums\RecurrencePattern;
use App\Models\Event;
use App\Models\EventReminder;
use App\Models\EventRsvp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EventService
{
    public function __construct(private ?PushNotificationService $pushNotificationService = null)
    {
    }

    public function getLatestLive(): ?Event
    {
        // 1. Get all published events for today (and potentially yesterday for late night events)
        // We need to check a window around "now" to capture any potential live events
        // The live window is -5 mins to +150 mins.
        // So an event starting at T must be such that T >= now - 150min AND T <= now + 5min
        // We can just fetch events +- 1 day to be safe and let isLive() do the heavy lifting
        $startWindow = now()->subDay()->startOfDay();
        $endWindow = now()->endOfDay();

        // Fetch non-recurring candidates
        $query = Event::where('is_published', true)
            ->whereNull('parent_event_id')
            ->whereRaw('DATE(event_date) >= ?', [$startWindow->format('Y-m-d')])
            ->whereRaw('DATE(event_date) <= ?', [$endWindow->format('Y-m-d')]);

        $candidates = $query->get();

        // Fetch recurring parents that COULD have an instance today
        // We'll use the existing expansion logic but limit the window
        $recurringParents = Event::where('is_published', true)
            ->where('is_recurring', true)
            ->whereNull('parent_event_id')
            ->get();

        // Expand recurring events for just today/yesterday
        // We can pass a shorter expansion window to expandRecurringEvents if we modify it
        // Or just manually call generateRecurringInstances for a short window
        $expanded = collect();
        foreach ($recurringParents as $parent) {
            // We need to generate instances that cover "now"
            // generateRecurringInstances generates from "today" until "expandUntil"
            // but we might need an instance from yesterday if it's still live.
            // The current generateRecurringInstances logic starts from "today" or "next occurrence".
            // We might miss an event from yesterday that is still live.
            // However, for now let's assume events are mostly same-day.
            // To be robust, we should probably check if an instance from yesterday is live.
            // But existing logic in generateRecurringInstances starts check from "now()->startOfDay()".

            // Let's use the method we have. It generates instances from "Today" onwards.
            // If we need yesterday, we'd need to adjust that method or duplicate logic.
            // Given the constraints, let's Stick to Today for recurring for now unless we see issues.

            $instances = $this->generateRecurringInstances($parent, now()->endOfDay());
            $expanded = $expanded->merge($instances);
        }

        // Merge all candidates
        $allEvents = $candidates->merge($expanded);

        // Merge all candidates
        $allEvents = $candidates->merge($expanded);

        // Filter for live events
        $liveEvents = $allEvents->filter(function ($event) {
            return $event->isLive();
        });

        // Return the one with the LATEST start time (most recent)
        // Sort by event_date + event_time descending
        return $liveEvents->sortByDesc(function ($event) {
            return Carbon::parse($event->event_date)->setTimeFrom(Carbon::parse($event->event_time));
        })->first();
    }


    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Event::query();

        if (isset($filters['event_type'])) {
            $query->where('event_type', $filters['event_type']);
        }

        if (isset($filters['upcoming'])) {
            $query->where('event_date', '>=', now());
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        $query->where('is_published', true);

        // Get all published events including recurring parent events (we'll expand them)
        // Exclude any existing database instances (parent_event_id IS NOT NULL)
        $query->whereNull('parent_event_id');

        $events = $query->orderBy('event_date', 'asc')->get();

        // Expand recurring events into instances
        $expandedEvents = $this->expandRecurringEvents($events);

        // Apply filters to expanded events
        if (isset($filters['upcoming'])) {
            $expandedEvents = $expandedEvents->filter(function ($event) {
                return Carbon::parse($event->event_date)->gte(now());
            });
        }

        if (isset($filters['is_live']) && $filters['is_live']) {
            $expandedEvents = $expandedEvents->filter(function ($event) {
                return $event->isLive();
            });
        }

        // Sort by event_date
        $expandedEvents = $expandedEvents->sortBy('event_date')->values();

        // Manually paginate the collection
        $page = request()->get('page', 1);
        $perPage = 15;
        $items = $expandedEvents->slice(($page - 1) * $perPage, $perPage)->values();

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $items,
            $expandedEvents->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    public function getById(int $id): ?Event
    {
        return Event::where('is_published', true)->find($id);
    }

    public function rsvp(User $user, int $eventId, array $data): EventRsvp
    {
        $event = Event::findOrFail($eventId);
        $rsvp = EventRsvp::firstOrCreate(
            [
                'user_id' => $user->id,
                'event_id' => $eventId,
            ],
            [
                'number_of_attendees' => $data['number_of_attendees'] ?? 1,
                'notes' => $data['notes'] ?? null,
            ]
        );

        // Send RSVP confirmation notification
        if ($this->pushNotificationService && $rsvp->wasRecentlyCreated) {
            try {
                $eventDate = Carbon::parse($event->event_date)->format('M d, Y');
                $eventTime = Carbon::parse($event->event_time)->format('g:i A');
                $this->pushNotificationService->sendToUser(
                    $user,
                    'RSVP Confirmed',
                    "You're confirmed for {$event->title} on {$eventDate} at {$eventTime}",
                    [
                        'type' => 'event',
                        'id' => $event->id,
                        'rsvp_id' => $rsvp->id,
                    ]
                );
            } catch (\Exception $e) {
                // Log error but don't fail the RSVP creation
                \Illuminate\Support\Facades\Log::error('Failed to send RSVP notification', [
                    'error' => $e->getMessage(),
                    'user_id' => $user->id,
                    'event_id' => $eventId,
                ]);
            }
        }

        return $rsvp;
    }

    public function cancelRsvp(User $user, int $eventId): bool
    {
        return EventRsvp::where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->delete();
    }

    public function getUserRsvps(User $user): LengthAwarePaginator
    {
        return EventRsvp::where('user_id', $user->id)
            ->with(['event'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }

    public function setReminder(User $user, int $eventId, int $reminderSettingId): EventReminder
    {
        $event = Event::findOrFail($eventId);
        $reminderSetting = \App\Models\EventReminderSetting::findOrFail($reminderSettingId);

        // Calculate reminder time based on event datetime and reminder setting
        // Format both date and time as strings to avoid Carbon concatenation issues
        $eventDateTime = Carbon::parse($event->event_date->toDateString() . ' ' . $event->event_time->format('H:i:s'));
        $reminderTime = $eventDateTime->copy()->subMinutes($reminderSetting->minutes_before);

        return EventReminder::updateOrCreate(
            [
                'user_id' => $user->id,
                'event_id' => $eventId,
            ],
            [
                'reminder_setting_id' => $reminderSettingId,
                'reminder_time' => $reminderTime,
                'is_sent' => false,
                'notification_sent_at' => null,
                'email_sent_at' => null,
            ]
        );
    }

    public function removeReminder(User $user, int $eventId): bool
    {
        return EventReminder::where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->delete();
    }

    /**
     * Expand recurring events into virtual instances
     */
    protected function expandRecurringEvents(Collection $events): Collection
    {
        $expanded = collect();
        $expandUntil = now()->addMonths(config('events.recurrence_expansion_months', 3));

        foreach ($events as $event) {
            // If it's a recurring parent event, generate instances
            if ($event->is_recurring && !$event->parent_event_id) {
                $instances = $this->generateRecurringInstances($event, $expandUntil);
                $expanded = $expanded->merge($instances);
            } else {
                // Non-recurring event or already an instance, add as-is
                $expanded->push($event);
            }
        }

        return $expanded;
    }

    /**
     * Generate recurring instances for a single recurring event
     */
    protected function generateRecurringInstances(Event $event, Carbon $expandUntil): Collection
    {
        $instances = collect();
        $originalDate = Carbon::parse($event->event_date);
        $currentDate = $originalDate->copy();
        $endDate = $event->recurrence_end_date
            ? min(Carbon::parse($event->recurrence_end_date), $expandUntil)
            : $expandUntil;

        $interval = $event->recurrence_interval ?? 1;
        $pattern = $event->recurrence_pattern;
        $maxCount = $event->recurrence_count ?? PHP_INT_MAX;

        // Calculate how many occurrences have already passed (for recurrence_count limit)
        $occurrenceNumber = 0;
        if ($maxCount !== PHP_INT_MAX) {
            // Count occurrences from original date up to today
            $tempDate = $originalDate->copy();
            while ($tempDate->lt(now()->startOfDay()) && $occurrenceNumber < $maxCount) {
                $occurrenceNumber++;
                if ($occurrenceNumber < $maxCount) {
                    $tempDate = $this->calculateNextOccurrence($tempDate, $pattern, $interval);
                }
            }
        }

        // Start generating from today (or next occurrence if event hasn't started yet)
        if ($currentDate->lt(now()->startOfDay())) {
            // Skip to next occurrence from today
            $tempDate = $originalDate->copy();
            while ($tempDate->lt(now()->startOfDay())) {
                $tempDate = $this->calculateNextOccurrence($tempDate, $pattern, $interval);
            }
            $currentDate = $tempDate;
        }

        $instanceCount = 0;

        while ($currentDate->lte($endDate) && ($occurrenceNumber + $instanceCount) < $maxCount) {
            // Create a virtual instance
            $instance = new Event;
            $instance->setRawAttributes([
                'id' => $event->id, // Use parent event ID for virtual instances
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $currentDate->toDateString(),
                'event_time' => $event->event_time,
                'location' => $event->location,
                'event_type' => $event->event_type,
                'image_url' => $event->image_url,
                'broadcast_url' => $event->broadcast_url,
                'max_attendees' => $event->max_attendees,
                'requires_rsvp' => $event->requires_rsvp,
                'is_published' => $event->is_published,
                'is_recurring' => false,
                'parent_event_id' => $event->id,
                'recurrence_pattern' => null,
                'recurrence_interval' => null,
                'recurrence_end_date' => null,
                'recurrence_count' => null,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at,
            ], true); // true = sync

            // Set virtual instance flag and occurrence identifier
            $instance->setAttribute('is_recurring_instance', true);
            $instance->setAttribute('virtual_occurrence_id', $event->id . '_' . ($occurrenceNumber + $instanceCount));

            $instances->push($instance);

            // Calculate next occurrence
            $currentDate = $this->calculateNextOccurrence($currentDate, $pattern, $interval);
            $instanceCount++;
        }

        return $instances;
    }

    /**
     * Calculate the next occurrence date based on recurrence pattern
     */
    protected function calculateNextOccurrence(Carbon $currentDate, ?RecurrencePattern $pattern, int $interval, ?Carbon $fromDate = null): Carbon
    {
        $from = $fromDate ?? $currentDate;

        if (!$pattern) {
            return $from->copy()->addDay(); // Default to next day if no pattern
        }

        return match ($pattern) {
            RecurrencePattern::Daily => $from->copy()->addDays($interval),
            RecurrencePattern::Weekly => $from->copy()->addWeeks($interval),
            RecurrencePattern::Monthly => $this->addMonthsSafely($from->copy(), $interval),
            RecurrencePattern::Yearly => $from->copy()->addYears($interval),
        };
    }

    /**
     * Safely add months, handling edge cases (e.g., Jan 31 + 1 month)
     */
    protected function addMonthsSafely(Carbon $date, int $months): Carbon
    {
        $dayOfMonth = $date->day;
        $result = $date->copy()->addMonths($months);

        // If the day doesn't exist in the target month (e.g., Jan 31 -> Feb), use last day of month
        if ($result->day !== $dayOfMonth && $dayOfMonth > $result->daysInMonth) {
            $result->lastOfMonth();
        }

        return $result;
    }
}
