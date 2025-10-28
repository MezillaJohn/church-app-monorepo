<?php

namespace App\Services;

use App\Models\Sermon;
use App\Models\Favorite;
use App\Models\WatchLater;
use App\Models\SermonProgress;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SermonService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Sermon::query()->with(['category']);

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['speaker'])) {
            $query->where('speaker', 'like', '%' . $filters['speaker'] . '%');
        }

        if (isset($filters['series'])) {
            $query->where('series', 'like', '%' . $filters['series'] . '%');
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getById(int $id): ?Sermon
    {
        return Sermon::with(['category'])->find($id);
    }

    public function toggleFavorite(User $user, int $sermonId): bool
    {
        $favorite = Favorite::where('user_id', $user->id)
            ->where('favoritable_type', Sermon::class)
            ->where('favoritable_id', $sermonId)
            ->first();

        if ($favorite) {
            $favorite->delete();

            DB::table('sermons')->where('id', $sermonId)->decrement('favorites_count');

            return false;
        }

        Favorite::create([
            'user_id' => $user->id,
            'favoritable_type' => Sermon::class,
            'favoritable_id' => $sermonId,
        ]);

        DB::table('sermons')->where('id', $sermonId)->increment('favorites_count');

        return true;
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
}

