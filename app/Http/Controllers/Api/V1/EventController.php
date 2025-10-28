<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\EventResource;
use App\Http\Resources\Api\V1\EventRsvpResource;
use App\Services\EventService;
use Illuminate\Http\Request;

class EventController extends BaseController
{
    public function __construct(private EventService $eventService)
    {
    }

    public function index(Request $request)
    {
        try {
            $events = $this->eventService->getAll($request->all());
            return $this->ok('Events retrieved successfully', EventResource::collection($events));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve events', ['exception' => $e->getMessage()], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $event = $this->eventService->getById($id);

            if (!$event) {
                return $this->error('Event not found', [], 404);
            }

            return $this->ok('Event retrieved successfully', new EventResource($event));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve event', ['exception' => $e->getMessage()], 500);
        }
    }

    public function rsvp(Request $request, int $id)
    {
        try {
            $request->validate([
                'number_of_attendees' => 'sometimes|integer|min:1',
                'notes' => 'sometimes|string|max:500',
            ]);

            $rsvp = $this->eventService->rsvp($request->user(), $id, $request->all());
            return $this->ok('RSVP successful', new EventRsvpResource($rsvp));
        } catch (\Exception $e) {
            return $this->error('Failed to RSVP', ['exception' => $e->getMessage()], 500);
        }
    }

    public function cancelRsvp(Request $request, int $id)
    {
        try {
            $this->eventService->cancelRsvp($request->user(), $id);
            return $this->ok('RSVP cancelled successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to cancel RSVP', ['exception' => $e->getMessage()], 500);
        }
    }

    public function myRsvps(Request $request)
    {
        try {
            $rsvps = $this->eventService->getUserRsvps($request->user());
            return $this->ok('My RSVPs retrieved successfully', EventRsvpResource::collection($rsvps));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve RSVPs', ['exception' => $e->getMessage()], 500);
        }
    }

    public function setReminder(Request $request, int $id)
    {
        try {
            $request->validate([
                'reminder_time' => 'required|date',
            ]);

            $reminder = $this->eventService->setReminder(
                $request->user(),
                $id,
                new \DateTime($request->reminder_time)
            );

            return $this->ok('Reminder set successfully', $reminder);
        } catch (\Exception $e) {
            return $this->error('Failed to set reminder', ['exception' => $e->getMessage()], 500);
        }
    }

    public function removeReminder(Request $request, int $id)
    {
        try {
            $this->eventService->removeReminder($request->user(), $id);
            return $this->ok('Reminder removed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to remove reminder', ['exception' => $e->getMessage()], 500);
        }
    }
}
