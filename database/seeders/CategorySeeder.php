<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sermon Categories
        $sermonCategories = [
            [
                'name' => 'Sunday Service',
                'slug' => 'sunday-service',
                'description' => 'Weekly Sunday worship services and teachings',
                'type' => 'sermon',
            ],
            [
                'name' => 'Bible Study',
                'slug' => 'bible-study',
                'description' => 'Deep dive into biblical scriptures and teachings',
                'type' => 'sermon',
            ],
            [
                'name' => 'Prayer Meeting',
                'slug' => 'prayer-meeting',
                'description' => 'Weekly prayer and intercession sessions',
                'type' => 'sermon',
            ],
            [
                'name' => 'Youth Service',
                'slug' => 'youth-service',
                'description' => 'Special services and teachings for youth',
                'type' => 'sermon',
            ],
            [
                'name' => 'Special Events',
                'slug' => 'special-events',
                'description' => 'Special gatherings and celebrations',
                'type' => 'sermon',
            ],
        ];

        // Book Categories
        $bookCategories = [
            [
                'name' => 'Christian Living',
                'slug' => 'christian-living',
                'description' => 'Books on living a Christian life in today\'s world',
                'type' => 'book',
            ],
            [
                'name' => 'Bible Study',
                'slug' => 'bible-study-books',
                'description' => 'Books for studying and understanding the Bible',
                'type' => 'book',
            ],
            [
                'name' => 'Prayer',
                'slug' => 'prayer',
                'description' => 'Books on prayer and spiritual growth',
                'type' => 'book',
            ],
            [
                'name' => 'Devotional',
                'slug' => 'devotional',
                'description' => 'Daily devotions and spiritual encouragement',
                'type' => 'book',
            ],
            [
                'name' => 'Theology',
                'slug' => 'theology',
                'description' => 'Books on Christian theology and doctrine',
                'type' => 'book',
            ],
            [
                'name' => 'Biography',
                'slug' => 'biography',
                'description' => 'Biographies of Christian leaders and saints',
                'type' => 'book',
            ],
        ];

        // Create sermon categories
        foreach ($sermonCategories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => $category['description'],
                'type' => $category['type'],
                'is_active' => true,
            ]);
        }

        // Create book categories
        foreach ($bookCategories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => $category['description'],
                'type' => $category['type'],
                'is_active' => true,
            ]);
        }
    }
}
