<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BookRating;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BookService
{
    public function __construct(private SettingsService $settingsService)
    {
    }

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Book::query()->with(['category']);

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('author', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        $query->where('is_published', true);

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getById(int $id): ?Book
    {
        return Book::with(['category'])->where('is_published', true)->find($id);
    }

    public function getFeatured(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return Book::where('is_published', true)
            ->where('is_featured', true)
            ->with(['category'])
            ->orderBy('purchases_count', 'desc')
            ->limit($limit)
        ->get();
}

    public function checkIfPurchased(User $user, int $bookId): bool
    {
        // Check if temporary paid access mode is enabled
        $temporaryAccessMode = $this->settingsService->get('books.temporary_paid_access_mode', false);

        if ($temporaryAccessMode) {
            return true; // Grant access to all users when temporary mode is ON
        }

        // Normal purchase verification
        return $user->bookPurchases()->where('book_id', $bookId)->where('status', 'completed')->exists();
    }


    public function getPurchasedBooks(User $user): LengthAwarePaginator
    {
        $purchases = $user->bookPurchases()
            ->with(['book.category'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return $purchases;
    }

    /**
     * Rate a book
     */
    public function rateBook(User $user, int $bookId, int $rating, ?string $review = null): BookRating
    {
        return DB::transaction(function () use ($user, $bookId, $rating, $review) {
            // Check if user already rated this book
            $existingRating = BookRating::where('user_id', $user->id)
                ->where('book_id', $bookId)
                ->first();

            if ($existingRating) {
                // Update existing rating
                $existingRating->update([
                    'rating' => $rating,
                    'review' => $review,
                ]);
                $bookRating = $existingRating;
            } else {
                // Create new rating
                $bookRating = BookRating::create([
                    'user_id' => $user->id,
                    'book_id' => $bookId,
                    'rating' => $rating,
                    'review' => $review,
                ]);
            }

            // Recalculate book's average rating
            $this->updateBookRating($bookId);

            return $bookRating;
        });
    }

    /**
     * Update book's average rating and count
     */
    protected function updateBookRating(int $bookId): void
    {
        $book = Book::findOrFail($bookId);
        $ratings = BookRating::where('book_id', $bookId)->get();

        $averageRating = $ratings->avg('rating');
        $ratingsCount = $ratings->count();

        $book->update([
            'average_rating' => round($averageRating ?? 0, 2),
            'ratings_count' => $ratingsCount,
        ]);
    }
}

