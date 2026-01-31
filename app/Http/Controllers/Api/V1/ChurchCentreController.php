<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\ChurchCentreResource;
use App\Models\ChurchCentre;

class ChurchCentreController extends BaseController
{
    public function index()
    {
        try {
            $centres = ChurchCentre::where('is_active', true)
                ->orderBy('name')
                ->get();

            return $this->ok('Church centres retrieved successfully', ChurchCentreResource::collection($centres));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve church centres', ['exception' => $e->getMessage()], 500);
        }
    }
}
