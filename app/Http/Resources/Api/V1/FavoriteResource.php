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
                'favoritable_type' => $this->favoritable_type,
                'favoritable_id' => $this->favoritable_id,
            ],
            'relationships' => [
                'sermon' => $this->when(
                    $this->relationLoaded('favoritable') && $this->favoritable instanceof \App\Models\Sermon,
                    fn () => new SermonResource($this->favoritable)
                ),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
            ],
        ];
    }
}
