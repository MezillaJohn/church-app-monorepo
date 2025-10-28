<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
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
            'type' => 'book',
            'attributes' => [
                'title' => $this->title,
                'author' => $this->author,
                'description' => $this->description,
                'price' => $this->price,
                'cover_image' => $this->cover_image,
                'file_url' => $this->file_url,
                'purchases_count' => $this->purchases_count ?? 0,
                'average_rating' => $this->average_rating ?? 0,
                'is_featured' => $this->is_featured,
                'is_published' => $this->is_published,
            ],
            'relationships' => [
                'category' => new CategoryResource($this->whenLoaded('category')),
                'purchases_count' => $this->when(isset($this->purchases_count), $this->purchases_count),
                'ratings_count' => $this->when(isset($this->ratings_count), $this->ratings_count),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

