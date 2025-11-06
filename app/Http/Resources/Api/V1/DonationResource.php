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
                'currency' => $this->currency,
                'amount_in_ngn' => $this->amount_in_ngn,
                'payment_method' => $this->payment_method,
                'payment_gateway' => $this->payment_gateway,
                'transaction_reference' => $this->transaction_reference,
                'status' => $this->status,
                'note' => $this->note,
                'is_anonymous' => $this->is_anonymous,
            ],
            'relationships' => [
                'donation_type' => $this->when(
                    $this->relationLoaded('donationType'),
                    fn() => [
                        'id' => $this->donationType->id,
                        'name' => $this->donationType->name,
                        'description' => $this->donationType->description,
                    ]
                ),
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

