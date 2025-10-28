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
                'price_paid' => $this->price_paid,
                'status' => $this->status,
                'payment_method' => $this->payment_method,
                'transaction_reference' => $this->transaction_reference,
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
                        'price' => $this->book->price,
                        'average_rating' => $this->book->average_rating,
                    ]
                ),
            ],
            'meta' => [
                'purchased_at' => $this->created_at?->toISOString(),
            ],
        ];
    }
}

