<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventRsvp;
use App\Models\EventReminder;
use App\Models\User;
use App\Enums\RecurrencePattern;
use App\Services\PushNotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class EventService
{
    public function __construct(private ?PushNotificationService $pushNotificationService = null)
    {
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

    public function setReminder(User $user, int $eventId, \DateTime $reminderTime): EventReminder
    {
        return EventReminder::updateOrCreate(
            [
                'user_id' => $user->id,
                'event_id' => $eventId,
            ],
            [
                'reminder_time' => $reminderTime,
                'is_sent' => false,
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
            $instance = new Event([
                'id' => $event->id . '_' . ($occurrenceNumber + $instanceCount), // Virtual ID to avoid conflicts
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $currentDate->toDateString(),
                'event_time' => $event->event_time,
                'location' => $event->location,
                'event_type' => $event->event_type,
                'image_url' => $event->image_url,
                'max_attendees' => $event->max_attendees,
                'requires_rsvp' => $event->requires_rsvp,
                'is_published' => $event->is_published,
                'is_recurring' => false,
                'parent_event_id' => $event->id,
            ]);

            // Set virtual instance flag
            $instance->setAttribute('is_recurring_instance', true);

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

