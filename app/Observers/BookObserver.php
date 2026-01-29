<?php

namespace App\Observers;

use App\Models\Book;

class BookObserver
{
    /**
     * Handle the Book "created" event.
     */
    public function created(Book $book): void
    {
        if ($book->is_published) {
            \App\Jobs\ProcessNewBookNotifications::dispatch($book);
        }
    }

    public function updated(Book $book): void
    {
        if ($book->is_published && $book->wasChanged('is_published')) {
            \App\Jobs\ProcessNewBookNotifications::dispatch($book);
        }
    }

    /**
     * Handle the Book "deleted" event.
     */
    public function deleted(Book $book): void
    {
        //
    }

    /**
     * Handle the Book "restored" event.
     */
    public function restored(Book $book): void
    {
        //
    }

    /**
     * Handle the Book "force deleted" event.
     */
    public function forceDeleted(Book $book): void
    {
        //
    }
}
