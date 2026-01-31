<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\SeriesResource;
use App\Models\SermonSeries;
use Illuminate\Http\Request;

class SeriesController extends BaseController
{
    /**
     * Get all series with sermons
     */
    public function index(Request $request)
    {
        try {
            $query = SermonSeries::query()
                ->with(['sermons' => function ($query) {
                    $query->where('is_published', true)
                        ->orderBy('date', 'desc');
                }])
                ->withCount('sermons');

            // Filter active series if requested
            if ($request->has('active') && $request->boolean('active')) {
                $query->where('is_active', true);
            }

            $series = $query->orderBy('name', 'asc')->get();

            return $this->ok('Series retrieved successfully', SeriesResource::collection($series));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve series', ['exception' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single series with sermons
     */
    public function show(int $id)
    {
        try {
            $series = SermonSeries::with(['sermons' => function ($query) {
                $query->where('is_published', true)
                    ->orderBy('date', 'desc');
            }])
                ->withCount('sermons')
                ->find($id);

            if (! $series) {
                return $this->error('Series not found', [], 404);
            }

            return $this->ok('Series retrieved successfully', new SeriesResource($series));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve series', ['exception' => $e->getMessage()], 500);
        }
    }
}
