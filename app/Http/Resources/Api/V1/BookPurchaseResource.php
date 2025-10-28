<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookPurchaseResource extends JsonResource
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
            'type' => 'book_purchase',
            'attributes' => [
                'payment_reference' => $this->payment_reference,
                'amount' => $this->amount,
                'payment_status' => $this->payment_status,
            ],
            'relationships' => [
                'user' => $this->when(
                    $this->relationLoaded('user'),
                    fn() => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                    ]
                ),
                'book' => $this->when(
                    $this->relationLoaded('book'),
                    fn() => [
                        'id' => $this->book->id,
                        'title' => $this->book->title,
                        'cover_image' => $this->book->cover_image,
                    ]
                ),
            ],
            'meta' => [
                'purchased_at' => $this->created_at?->toISOString(),
            ],
        ];
    }
}

