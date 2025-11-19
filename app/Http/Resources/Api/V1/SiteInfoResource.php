<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteInfoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => 1,
            'type' => 'site_info',
            'attributes' => [
                'social_links' => [
                    'facebook' => $this->resource['social_links']['facebook'] ?? '',
                    'twitter' => $this->resource['social_links']['twitter'] ?? '',
                    'instagram' => $this->resource['social_links']['instagram'] ?? '',
                    'linkedin' => $this->resource['social_links']['linkedin'] ?? '',
                    'youtube' => $this->resource['social_links']['youtube'] ?? '',
                ],
            ],
        ];
    }
}

