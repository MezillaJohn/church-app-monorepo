<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
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
            'type' => 'favorite',
            'attributes' => [
                'favoriteable_type' => $this->favoriteable_type,
                'favoriteable_id' => $this->favoriteable_id,
            ],
            'relationships' => [
                'sermon' => $this->when(
                    $this->relationLoaded('favoriteable') && $this->favoriteable instanceof \App\Models\Sermon,
                    fn() => new SermonResource($this->favoriteable)
                ),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
            ],
        ];
    }
}

