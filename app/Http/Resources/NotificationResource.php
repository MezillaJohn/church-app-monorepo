<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'type' => $this->type,
            'event_type' => $this->resolveEventType(),
            'event_id' => $this->event_id,
            'data' => $this->data, // Or decode if it's JSON: json_decode($this->data) or cast in model
            'read_status' => ! is_null($this->read_at),
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'event' => $this->whenLoaded('event'),
        ];
    }

    protected function resolveEventType(): string
    {
        if ($this->event_type === \App\Models\Event::class) {
            return 'event';
        }

        if ($this->event_type === \App\Models\Sermon::class) {
            if ($this->relationLoaded('event') && $this->event) {
                return $this->event->type->value ?? 'sermon';
            }

            return 'sermon';

            return 'sermon';
        }

        if ($this->event_type === \App\Models\Book::class) {
            return 'book';
        }

        return 'unknown';
    }
}
