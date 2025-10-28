<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'type' => 'user',
            'attributes' => [
                'name' => $this->name,
                'email' => $this->email,
                'church_centre' => $this->church_centre,
                'country' => $this->country,
                'phone' => $this->phone,
                'gender' => $this->gender,
                'church_member' => $this->church_member,
                'email_verified_at' => $this->email_verified_at?->toISOString(),
            ],
            'relationships' => [
                'donations' => [
                    'count' => $this->whenLoaded('donations', fn() => $this->donations->count()),
                ],
            ],
            'meta' => [
                'created_at' => $this->created_at?->toISOString(),
                'updated_at' => $this->updated_at?->toISOString(),
            ],
        ];
    }
}

