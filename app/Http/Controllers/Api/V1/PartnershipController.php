<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Requests\Api\V1\StorePartnershipRequest;
use App\Http\Resources\Api\V1\PartnershipResource;
use App\Http\Resources\Api\V1\PartnershipTypeResource;
use App\Models\Partnership;
use App\Models\PartnershipType;

class PartnershipController extends BaseController
{
    public function getPartnershipTypes()
    {
        try {
            $types = PartnershipType::where('is_active', true)->get();
            return $this->ok('Partnership types retrieved successfully', PartnershipTypeResource::collection($types));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve partnership types', ['exception' => $e->getMessage()], 500);
        }
    }

    public function store(StorePartnershipRequest $request)
    {
        try {
            $data = $request->validated();

            // If user is authenticated, set user_id if not provided
            if ($request->user() && !isset($data['user_id'])) {
                $data['user_id'] = $request->user()->id;
            }

            $partnership = Partnership::create($data);
            $partnership->load(['partnershipType', 'user']);

            return $this->ok('Partnership created successfully', new PartnershipResource($partnership), 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create partnership', ['exception' => $e->getMessage()], 500);
        }
    }
}

