<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartnershipResource extends JsonResource
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
            'type' => 'partnership',
            'attributes' => [
                'fullname' => $this->fullname,
                'phone_no' => $this->phone_no,
                'email' => $this->email,
                'interval' => $this->interval->value ?? $this->interval,
                'amount' => (float) $this->amount,
                'currency' => $this->currency,
            ],
            'relationships' => [
                'partnership_type' => $this->whenLoaded('partnershipType', function () {
                    return new PartnershipTypeResource($this->partnershipType);
                }),
                'user' => $this->whenLoaded('user', function () {
                    return $this->user ? new UserResource($this->user) : null;
                }),
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}
