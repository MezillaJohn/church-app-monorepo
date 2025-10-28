<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
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
            'type' => 'donation',
            'attributes' => [
                'amount' => $this->amount,
                'donation_type' => $this->donation_type,
                'payment_method' => $this->payment_method,
                'payment_reference' => $this->payment_reference,
                'status' => $this->status,
            ],
            'relationships' => [
                'user' => $this->when(
                    $this->relationLoaded('user'),
                    fn() => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                    ]
                ),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

