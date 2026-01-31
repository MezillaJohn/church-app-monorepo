<?php

namespace App\Services;

use App\Models\Favorite;
use App\Models\Sermon;
use App\Models\SermonProgress;
use App\Models\User;
use App\Models\WatchLater;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class SermonService
{
    public function getAll(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $query = Sermon::query()->with(['category', 'series']);

        if ($user) {
            $query->addSelect([
                '*',
                'is_favorited_by_user' => Favorite::select(DB::raw(1))
                    ->whereColumn('favoritable_id', 'sermons.id')
                    ->where('favoritable_type', Sermon::class)
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['speaker'])) {
            $query->where('speaker', 'like', '%'.$filters['speaker'].'%');
        }

        if (isset($filters['series_id'])) {
            $query->where('series_id', $filters['series_id']);
        }

        if (isset($filters['series'])) {
            $query->whereHas('series', function ($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['series'].'%');
            });
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description', 'like', '%'.$filters['search'].'%');
            });
        }

        if (isset($filters['sort'])) {
            $query->orderBy('created_at', $filters['sort']);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate(15);
    }

    public function getById(int $id, ?User $user = null): ?Sermon
    {
        $query = Sermon::with(['category', 'series']);

        if ($user) {
            $query->addSelect([
                '*',
                'is_favorited_by_user' => Favorite::select(DB::raw(1))
                    ->whereColumn('favoritable_id', 'sermons.id')
                    ->where('favoritable_type', Sermon::class)
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);
        }

        return $query->find($id);
    }

    public function toggleFavorite(User $user, int $sermonId): bool
    {
        try {
            return DB::transaction(function () use ($user, $sermonId) {
                $favorite = Favorite::where('user_id', $user->id)
                    ->where('favoritable_type', Sermon::class)
                    ->where('favoritable_id', $sermonId)
                    ->first();

                if ($favorite) {
                    $favorite->delete();
                    Sermon::where('id', $sermonId)->decrement('favorites_count');

                    return false;
                }

                Favorite::create([
                    'user_id' => $user->id,
                    'favoritable_type' => Sermon::class,
                    'favoritable_id' => $sermonId,
                ]);

                Sermon::where('id', $sermonId)->increment('favorites_count');

                return true;
            });
        } catch (QueryException $e) {
            // Handle unique constraint violation (duplicate favorite)
            if ($e->getCode() === '23000') {
                throw new \Exception('Favorite already exists');
            }
            throw $e;
        }
    }

    public function getUserFavorites(User $user): LengthAwarePaginator
    {
        return Favorite::where('user_id', $user->id)
            ->where('favoritable_type', Sermon::class)
            ->with(['favoritable.category'])
            ->paginate(15);
    }

    public function addToWatchLater(User $user, int $sermonId): bool
    {
        WatchLater::firstOrCreate([
            'user_id' => $user->id,
            'sermon_id' => $sermonId,
        ]);

        return true;
    }

    public function getUserWatchLater(User $user): LengthAwarePaginator
    {
        return WatchLater::where('user_id', $user->id)
            ->with(['sermon.category'])
            ->paginate(15);
    }

    public function updateProgress(User $user, int $sermonId, int $progress, bool $isCompleted = false): void
    {
        SermonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'sermon_id' => $sermonId,
            ],
            [
                'progress' => $progress,
                'is_completed' => $isCompleted,
            ]
        );
    }

    public function getProgress(User $user, int $sermonId): ?SermonProgress
    {
        return SermonProgress::where('user_id', $user->id)
            ->where('sermon_id', $sermonId)
            ->first();
    }

    /**
     * Get related sermons based on category, series, and speaker
     */
    public function getRelatedSermons(Sermon $sermon, int $limit = 6, ?User $user = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = Sermon::where('id', '!=', $sermon->id)
            ->where('is_published', true)
            ->where('category_id', $sermon->category_id)
            ->with(['category', 'series']);

        if ($user) {
            $query->addSelect([
                '*',
                'is_favorited_by_user' => Favorite::select(DB::raw(1))
                    ->whereColumn('favoritable_id', 'sermons.id')
                    ->where('favoritable_type', Sermon::class)
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);
        }

        // Build priority conditions: series > speaker > category (already filtered)
        $priorityConditions = [];

        if ($sermon->series_id) {
            $priorityConditions[] = ['series_id', '=', $sermon->series_id];
        }

        if ($sermon->speaker) {
            $priorityConditions[] = ['speaker', '=', $sermon->speaker];
        }

        // Order by priority: series matches first, then speaker, then category
        if (! empty($priorityConditions)) {
            $query->where(function ($q) use ($priorityConditions) {
                foreach ($priorityConditions as $condition) {
                    $q->orWhere($condition[0], $condition[1], $condition[2]);
                }
            });
        }

        // Order by views (most viewed) then by date (most recent)
        return $query->orderBy('views', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getFeatured(array $filters = [], ?User $user = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Sermon::where('is_featured', true)
            ->where('is_published', true)
            ->with(['category', 'series']);

        if ($user) {
            $query->addSelect([
                '*',
                'is_favorited_by_user' => Favorite::select(DB::raw(1))
                    ->whereColumn('favoritable_id', 'sermons.id')
                    ->where('favoritable_type', Sermon::class)
                    ->where('user_id', $user->id)
                    ->limit(1),
            ]);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()->paginate(15);
    }
}
