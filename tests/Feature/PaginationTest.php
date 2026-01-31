<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\Sermon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_sermons_endpoint_returns_pagination_metadata()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create categories and sermons
        $category = Category::create([
            'name' => 'Sermon Category',
            'slug' => 'sermon-category',
            'type' => 'sermon',
            'is_active' => true,
        ]);

        // Create sermons locally
        for ($i = 0; $i < 20; $i++) {
            Sermon::create([
                'title' => "Sermon $i",
                'description' => "Description $i",
                'type' => 'audio',
                'speaker' => 'Speaker Name',
                'date' => now()->subDays($i),
                'category_id' => $category->id,
                'is_published' => true,
                'views' => 0,
                'favorites_count' => 0,
                'is_featured' => false,
            ]);
        }

        $response = $this->getJson('/api/v1/sermons');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'attributes' => [
                            'title',
                            'description',
                        ],
                    ],
                ],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
            ]);
    }

    public function test_books_endpoint_returns_pagination_metadata()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create categories and books
        $category = Category::create([
            'name' => 'Book Category',
            'slug' => 'book-category',
            'type' => 'book',
            'is_active' => true,
        ]);

        // Create books locally
        for ($i = 0; $i < 20; $i++) {
            Book::create([
                'title' => "Book $i",
                'author' => "Author $i",
                'description' => "Description $i",
                'price' => 10.00,
                'cover_image' => 'http://example.com/cover.jpg',
                'category_id' => $category->id,
                'is_published' => true,
                'average_rating' => 0,
                'ratings_count' => 0,
                'purchases_count' => 0,
                'is_featured' => false,
            ]);
        }

        $response = $this->getJson('/api/v1/books');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'attributes' => [
                            'title',
                            'author',
                            'description',
                        ],
                    ],
                ],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
            ]);
    }
}
