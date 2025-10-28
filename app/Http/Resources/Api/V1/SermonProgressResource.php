<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SermonProgressResource extends JsonResource
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
            'type' => 'sermon_progress',
            'attributes' => [
                'progress_seconds' => $this->progress_seconds,
                'completed' => $this->completed,
            ],
            'relationships' => [
                'sermon' => $this->when(
                    $this->relationLoaded('sermon'),
                    fn() => [
                        'id' => $this->sermon->id,
                        'title' => $this->sermon->title,
                        'duration' => $this->sermon->duration,
                    ]
                ),
            ],
            'meta' => [
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

