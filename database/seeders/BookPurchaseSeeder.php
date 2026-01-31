<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BookPurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();
        $books = \App\Models\Book::all();

        if ($users->isEmpty() || $books->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Each user buys 0-3 random books
            $purchasedBooks = $books->random(rand(0, 3));

            foreach ($purchasedBooks as $book) {
                \App\Models\BookPurchase::factory()->create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'price_paid' => $book->price ?? 1000,
                ]);
            }
        }
    }
}
