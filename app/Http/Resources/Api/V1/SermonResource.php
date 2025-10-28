<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SermonResource extends JsonResource
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
            'type' => 'sermon',
            'attributes' => [
                'title' => $this->title,
                'description' => $this->description,
                'type' => $this->type,
                'speaker' => $this->speaker,
                'date' => $this->date?->toDateString(),
                'audio_file_url' => $this->audio_file_url,
                'youtube_video_id' => $this->youtube_video_id,
                'thumbnail_url' => $this->thumbnail_url,
                'duration' => $this->duration,
                'series' => $this->series,
                'views' => $this->views,
                'is_featured' => $this->is_featured,
                'is_published' => $this->is_published,
            ],
            'relationships' => [
                'category' => new CategoryResource($this->whenLoaded('category')),
                'favorites_count' => $this->when(isset($this->favorites_count), $this->favorites_count),
                'watch_later_count' => $this->when(isset($this->watch_later_count), $this->watch_later_count),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

