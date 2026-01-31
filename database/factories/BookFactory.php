<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::query()->inRandomOrder()->first()->id ?? \App\Models\Category::factory(),
            'title' => $this->faker->sentence(4),
            'author' => $this->faker->name(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 500, 5000),
            'cover_image' => 'books/covers/default.jpg',
            'file_url' => 'books/files/default.pdf',
            'preview_pages' => 5,
            'average_rating' => $this->faker->randomFloat(1, 1, 5),
            'ratings_count' => $this->faker->numberBetween(0, 100),
            'purchases_count' => $this->faker->numberBetween(0, 500),
            'is_featured' => $this->faker->boolean(20),
            'is_published' => $this->faker->boolean(80),
        ];
    }
}
