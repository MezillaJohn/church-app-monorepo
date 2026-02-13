<?php

use App\Models\Category;
use App\Models\Sermon;
use App\Models\SermonSeries;
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


test('it uses sermon thumbnail if available', function () {
    $sermon = Sermon::create([
        'title' => 'Sermon With Thumbnail',
        'category_id' => $this->category->id,
        'thumbnail_url' => 'sermons/thumbnail.jpg',
        'type' => 'audio',
        'date' => now(),
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/' . $sermon->id);

    $response->assertOk()
        ->assertJsonPath('data.attributes.thumbnail_url', env('APP_URL') . '/storage/sermons/thumbnail.jpg');
});

test('it uses series thumbnail if sermon thumbnail is missing', function () {
    $series = SermonSeries::create([
        'name' => 'Test Series',
        'slug' => 'test-series',
        'image' => 'series/thumbnail.jpg',
        'is_active' => true,
    ]);

    $sermon = Sermon::create([
        'title' => 'Sermon Without Thumbnail',
        'category_id' => $this->category->id,
        'series_id' => $series->id,
        'thumbnail_url' => null,
        'type' => 'audio',
        'date' => now(),
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/' . $sermon->id);

    $response->assertOk()
        ->assertJsonPath('data.attributes.thumbnail_url', env('APP_URL') . '/storage/series/thumbnail.jpg');
});

test('it returns null if both sermon and series thumbnails are missing', function () {
    $series = SermonSeries::create([
        'name' => 'Test Series No Image',
        'slug' => 'test-series-no-image',
        'image' => null,
        'is_active' => true,
    ]);

    $sermon = Sermon::create([
        'title' => 'Sermon and Series No Thumbnail',
        'category_id' => $this->category->id,
        'series_id' => $series->id,
        'thumbnail_url' => null,
        'type' => 'audio',
        'date' => now(),
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/' . $sermon->id);

    $response->assertOk()
        ->assertJsonPath('data.attributes.thumbnail_url', null);
});

test('it returns null if sermon has no thumbnail and no series', function () {
    $sermon = Sermon::create([
        'title' => 'Sermon No Thumbnail No Series',
        'category_id' => $this->category->id,
        'series_id' => null,
        'thumbnail_url' => null,
        'type' => 'audio',
        'date' => now(),
    ]);

    Sanctum::actingAs($this->user);

    $response = $this->getJson('/api/v1/sermons/' . $sermon->id);

    $response->assertOk()
        ->assertJsonPath('data.attributes.thumbnail_url', null);
});
