<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventRsvpResource extends JsonResource
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
            'type' => 'event_rsvp',
            'attributes' => [
                'status' => $this->status,
                'number_of_guests' => $this->number_of_guests,
            ],
            'relationships' => [
                'user' => $this->when(
                    $this->relationLoaded('user'),
                    fn () => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                    ]
                ),
                'event' => $this->when(
                    $this->relationLoaded('event'),
                    fn () => [
                        'id' => $this->event->id,
                        'title' => $this->event->title,
                        'event_date' => $this->event->event_date?->toDateString(),
                    ]
                ),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}
