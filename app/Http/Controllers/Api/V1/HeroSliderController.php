<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\HeroSliderResource as ApiHeroSliderResource;
use App\Models\HeroSlider;

class HeroSliderController extends BaseController
{
    /**
     * Get all active hero sliders
     */
    public function index()
    {
        try {
            $sliders = HeroSlider::active()
                ->orderBy('order', 'asc')
                ->get();

            return $this->ok('Hero sliders retrieved successfully', ApiHeroSliderResource::collection($sliders));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve hero sliders', ['exception' => $e->getMessage()], 500);
        }
    }
}
