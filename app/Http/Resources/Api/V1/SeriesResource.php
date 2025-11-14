<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeriesResource extends JsonResource
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
            'type' => 'series',
            'attributes' => [
                'name' => $this->name,
                'slug' => $this->slug,
                'description' => $this->description,
                'preacher' => $this->preacher,
                'image' => $this->image ? asset('storage/' . $this->image) : null,
                'is_active' => $this->is_active,
            ],
            'relationships' => [
                'sermons' => $this->whenLoaded('sermons', function () {
                    return SermonResource::collection($this->sermons);
                }),
                'sermons_count' => $this->when(isset($this->sermons_count), $this->sermons_count),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

