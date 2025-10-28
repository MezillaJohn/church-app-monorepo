<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;

class BookPolicy
{
    /**
     * Determine if the user can view any books.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view published books
    }

    /**
     * Determine if the user can view the book.
     */
    public function view(?User $user, Book $book): bool
    {
        return $book->is_published || ($user && $user->isAdmin());
    }

    /**
     * Determine if the user can download the book.
     */
    public function download(User $user, Book $book): bool
    {
        // Check if user has purchased the book
        return $book->purchases()->where('user_id', $user->id)
            ->where('payment_status', 'completed')
            ->exists() || $user->isAdmin();
    }

    /**
     * Determine if the user can create books.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can update the book.
     */
    public function update(User $user, Book $book): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can delete the book.
     */
    public function delete(User $user, Book $book): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if the user can rate the book.
     */
    public function rate(User $user, Book $book): bool
    {
        // User must have purchased the book
        return $book->purchases()
            ->where('user_id', $user->id)
            ->where('payment_status', 'completed')
            ->exists() || $user->isAdmin();
    }
}

