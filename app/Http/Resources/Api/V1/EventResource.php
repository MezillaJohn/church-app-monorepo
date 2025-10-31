<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'event',
            'attributes' => [
                'title' => $this->title,
                'description' => $this->description,
                'event_date' => $this->event_date?->toDateString(),
                'event_time' => $this->event_time?->format('H:i'),
                'location' => $this->location,
                'event_type' => $this->event_type,
                'image_url' => $this->image_url,
                'max_attendees' => $this->max_attendees,
                'rsvp_count' => $this->whenLoaded('rsvps', fn() => $this->rsvps->count()) ?? 0,
                'requires_rsvp' => $this->requires_rsvp,
                'is_published' => $this->is_published,
                'is_recurring' => $this->is_recurring ?? false,
                'is_recurring_instance' => $this->when(
                    isset($this->is_recurring_instance),
                    fn() => $this->is_recurring_instance ?? false,
                    false
                ),
                'recurrence_pattern' => $this->recurrence_pattern?->value,
                'recurrence_interval' => $this->recurrence_interval ?? 1,
                'recurrence_end_date' => $this->recurrence_end_date?->toDateString(),
                'recurrence_count' => $this->recurrence_count,
            ],
            'relationships' => [
                'rsvps_count' => $this->when(isset($this->rsvps_count), $this->rsvps_count),
                'reminders_count' => $this->when(isset($this->reminders_count), $this->reminders_count),
                'parent_event' => $this->when(
                    $this->parent_event_id && $this->relationLoaded('parentEvent'),
                    fn() => new EventResource($this->parentEvent)
                ),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

