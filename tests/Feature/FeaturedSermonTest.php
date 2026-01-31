<?php

use App\Models\Category;
use App\Models\Sermon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    \Illuminate\Database\Eloquent\Model::unguard();

    // Create a category
    $this->category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
        'type' => 'sermon',
        'is_active' => true,
    ]);

    // Create a user
    $this->user = User::factory()->create();
});

test('it returns the latest featured sermon', function () {
    // Old featured sermon
    Sermon::create([
        'title' => 'Old Featured',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now()->subDays(10),
        'created_at' => now()->subDays(10),
        'type' => 'audio',
    ]);

    // New featured sermon
    $newFeatured = Sermon::create([
        'title' => 'New Featured',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now(),
        'type' => 'video',
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/featured');

    $response->assertOk()
        ->assertJsonPath('data.0.attributes.title', 'New Featured');
});

test('it filters featured sermon by type audio', function () {
    // Featured video
    Sermon::create([
        'title' => 'Video Sermon',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now(),
        'type' => 'video',
    ]);

    // Featured audio (older) - wait, if I want strictly type audio, even if older?
    // The query is `where('type', $filters['type'])`.
    $audioSermon = Sermon::create([
        'title' => 'Audio Sermon',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now()->subDays(1), // older than video
        'type' => 'audio',
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/featured?type=audio');

    $response->assertOk()
        ->assertJsonPath('data.0.attributes.title', 'Audio Sermon');
});

test('it filters featured sermon by type video', function () {
    $videoSermon = Sermon::create([
        'title' => 'Video Sermon',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now(),
        'type' => 'video',
    ]);

    Sermon::create([
        'title' => 'Audio Sermon',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now()->subDays(1),
        'type' => 'audio',
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/featured?type=video');

    $response->assertOk()
        ->assertJsonPath('data.0.attributes.title', 'Video Sermon');
});

test('it returns correct structure with user favorites', function () {
    $sermon = Sermon::create([
        'title' => 'Featured Sermon',
        'is_featured' => true,
        'is_published' => true,
        'category_id' => $this->category->id,
        'date' => now(),
        'created_at' => now(),
        'type' => 'audio',
    ]);

    // User favorites this sermon
    \App\Models\Favorite::create([
        'user_id' => $this->user->id,
        'favoritable_type' => Sermon::class,
        'favoritable_id' => $sermon->id,
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/featured');

    $response->assertOk()
        ->assertJsonPath('data.0.attributes.title', 'Featured Sermon');
});

test('it returns pagination metadata for featured sermons', function () {
    // Create multiple featured sermons
    for ($i = 0; $i < 20; $i++) {
        Sermon::create([
            'title' => "Featured Sermon $i",
            'is_featured' => true,
            'is_published' => true,
            'category_id' => $this->category->id,
            'date' => now()->subDays($i),
            'type' => 'audio',
        ]);
    }

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/featured');

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'message',
            'data',
            'links' => ['first', 'last', 'prev', 'next'],
            'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
        ]);
});
