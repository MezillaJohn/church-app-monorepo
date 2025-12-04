<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\FavoriteResource;
use App\Http\Resources\Api\V1\SermonProgressResource;
use App\Http\Resources\Api\V1\SermonResource;
use App\Http\Resources\Api\V1\WatchLaterResource;
use App\Services\SermonService;
use Illuminate\Http\Request;

class SermonController extends BaseController
{
    public function __construct(private SermonService $sermonService)
    {
    }

    public function index(Request $request)
    {
        try {
            $sermons = $this->sermonService->getAll($request->all(), $request->user());
            return $this->ok('Sermons retrieved successfully', SermonResource::collection($sermons));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve sermons', ['exception' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, int $id)
    {
        try {
            $sermon = $this->sermonService->getById($id, $request->user());

            if (!$sermon) {
                return $this->error('Sermon not found', [], 404);
            }

            $relatedSermons = $this->sermonService->getRelatedSermons($sermon, 6, $request->user());

            $resource = new SermonResource($sermon);
            $resource->relatedSermons = $relatedSermons;

            return $this->ok('Sermon retrieved successfully', $resource);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve sermon', ['exception' => $e->getMessage()], 500);
        }
    }

    public function toggleFavorite(Request $request, int $id)
    {
        try {
            $isFavorite = $this->sermonService->toggleFavorite($request->user(), $id);
            $message = $isFavorite ? 'Added to favorites' : 'Removed from favorites';
            return $this->ok($message, ['is_favorite' => $isFavorite]);
        } catch (\Exception $e) {
            return $this->error('Failed to update favorite', ['exception' => $e->getMessage()], 500);
        }
    }

    public function favorites(Request $request)
    {
        try {
            $favorites = $this->sermonService->getUserFavorites($request->user());
            return $this->ok('Favorites retrieved successfully', FavoriteResource::collection($favorites));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve favorites', ['exception' => $e->getMessage()], 500);
        }
    }

    public function addToWatchLater(Request $request, int $id)
    {
        try {
            $this->sermonService->addToWatchLater($request->user(), $id);
            return $this->ok('Added to watch later successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to add to watch later', ['exception' => $e->getMessage()], 500);
        }
    }

    public function watchLater(Request $request)
    {
        try {
            $watchLater = $this->sermonService->getUserWatchLater($request->user());
            return $this->ok('Watch later list retrieved successfully', WatchLaterResource::collection($watchLater));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve watch later list', ['exception' => $e->getMessage()], 500);
        }
    }

    public function updateProgress(Request $request, int $id)
    {
        try {
            $request->validate([
                'progress' => 'required|integer|min:0',
                'is_completed' => 'sometimes|boolean',
            ]);

            $this->sermonService->updateProgress(
                $request->user(),
                $id,
                $request->progress,
                $request->is_completed ?? false
            );

            return $this->ok('Progress updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update progress', ['exception' => $e->getMessage()], 500);
        }
    }

    public function getProgress(Request $request, int $id)
    {
        try {
            $progress = $this->sermonService->getProgress($request->user(), $id);

            if (!$progress) {
                return $this->ok('No progress recorded', ['progress' => 0, 'is_completed' => false]);
            }

            return $this->ok('Progress retrieved successfully', new SermonProgressResource($progress));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve progress', ['exception' => $e->getMessage()], 500);
        }
    }
}
