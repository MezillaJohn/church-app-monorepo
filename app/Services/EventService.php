<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventRsvp;
use App\Models\EventReminder;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EventService
{
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

        return $query->orderBy('event_date', 'asc')->paginate(15);
    }

    public function getById(int $id): ?Event
    {
        return Event::where('is_published', true)->find($id);
    }

    public function rsvp(User $user, int $eventId, array $data): EventRsvp
    {
        return EventRsvp::firstOrCreate(
            [
                'user_id' => $user->id,
                'event_id' => $eventId,
            ],
            [
                'number_of_attendees' => $data['number_of_attendees'] ?? 1,
                'notes' => $data['notes'] ?? null,
            ]
        );
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
}

