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
                'youtube_video_url' => $this->youtube_video_url,
                'embed_url' => $this->embed_url,
                'thumbnail_url' => $this->thumbnail_url,
                'duration' => $this->duration,
                'series' => $this->series,
                'views' => $this->views,
                'favorites_count' => $this->favorites_count ?? 0,
                'is_featured' => $this->is_featured,
                'is_published' => $this->is_published,
                'is_favorited' => $this->when(
                    $request->user() && $this->relationLoaded('favorites'),
                    fn() => $this->favorites->contains('user_id', $request->user()->id),
                    false
                ),
            ],
            'relationships' => [
                'category' => $this->whenLoaded('category', fn() => new CategoryResource($this->category)),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

