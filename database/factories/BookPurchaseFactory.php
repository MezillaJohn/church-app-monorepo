<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookPurchase>
 */
class BookPurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'book_id' => \App\Models\Book::factory(),
            'price_paid' => $this->faker->randomFloat(2, 500, 5000),
            'transaction_reference' => $this->faker->uuid(),
            'payment_method' => $this->faker->randomElement(['paystack', 'bank_transfer', 'card']),
            'status' => $this->faker->randomElement(['completed', 'pending', 'failed']),
        ];
    }
}
