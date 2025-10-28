<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'title' => 'The Purpose Driven Life',
                'author' => 'Rick Warren',
                'description' => 'A spiritual guide that helps believers discover God\'s unique purpose for their lives through a 40-day journey of self-discovery and spiritual growth.',
                'price' => 15.99,
                'category' => 'christian-living',
                'is_featured' => true,
                'preview_pages' => 10,
                'average_rating' => 4.5,
                'ratings_count' => 150,
                'purchases_count' => 500,
            ],
            [
                'title' => 'Mere Christianity',
                'author' => 'C.S. Lewis',
                'description' => 'A profound exploration of Christian faith and ethics, presenting the core beliefs of Christianity in a clear and compelling manner.',
                'price' => 12.99,
                'category' => 'theology',
                'is_featured' => true,
                'preview_pages' => 15,
                'average_rating' => 4.8,
                'ratings_count' => 200,
                'purchases_count' => 600,
            ],
            [
                'title' => 'The Pilgrim\'s Progress',
                'author' => 'John Bunyan',
                'description' => 'A classic allegorical tale of Christian\'s journey from the City of Destruction to the Celestial City, symbolizing the Christian life.',
                'price' => 10.99,
                'category' => 'theology',
                'is_featured' => false,
                'preview_pages' => 12,
                'average_rating' => 4.6,
                'ratings_count' => 120,
                'purchases_count' => 400,
            ],
            [
                'title' => 'Morning and Evening',
                'author' => 'Charles Spurgeon',
                'description' => 'Daily devotions for morning and evening, offering spiritual nourishment and reflection for every day of the year.',
                'price' => 14.99,
                'category' => 'devotional',
                'is_featured' => true,
                'preview_pages' => 8,
                'average_rating' => 4.7,
                'ratings_count' => 180,
                'purchases_count' => 550,
            ],
            [
                'title' => 'The Screwtape Letters',
                'author' => 'C.S. Lewis',
                'description' => 'A satirical novel featuring letters from a senior demon teaching his nephew about tempting human souls, offering insights on Christian faith.',
                'price' => 11.99,
                'category' => 'theology',
                'is_featured' => false,
                'preview_pages' => 14,
                'average_rating' => 4.4,
                'ratings_count' => 140,
                'purchases_count' => 450,
            ],
            [
                'title' => 'Fresh Wind, Fresh Fire',
                'author' => 'Jim Cymbala',
                'description' => 'Pastor Cymbala shares how prayer transformed his church and how God can renew your life through the power of prayer.',
                'price' => 13.99,
                'category' => 'prayer',
                'is_featured' => false,
                'preview_pages' => 10,
                'average_rating' => 4.5,
                'ratings_count' => 160,
                'purchases_count' => 480,
            ],
            [
                'title' => 'The Practice of the Presence of God',
                'author' => 'Brother Lawrence',
                'description' => 'Inspirational writings on living in constant awareness of God\'s presence and finding peace in everyday life.',
                'price' => 9.99,
                'category' => 'devotional',
                'is_featured' => false,
                'preview_pages' => 7,
                'average_rating' => 4.6,
                'ratings_count' => 110,
                'purchases_count' => 350,
            ],
            [
                'title' => 'Systematic Theology',
                'author' => 'Wayne Grudem',
                'description' => 'A comprehensive guide to Christian doctrine, covering essential theological topics with biblical foundations.',
                'price' => 25.99,
                'category' => 'theology',
                'is_featured' => true,
                'preview_pages' => 20,
                'average_rating' => 4.9,
                'ratings_count' => 250,
                'purchases_count' => 700,
            ],
            [
                'title' => 'Victory in Spiritual Warfare',
                'author' => 'Tony Evans',
                'description' => 'Understanding spiritual warfare and how to overcome the enemy through the power of prayer and God\'s Word.',
                'price' => 16.99,
                'category' => 'christian-living',
                'is_featured' => false,
                'preview_pages' => 11,
                'average_rating' => 4.4,
                'ratings_count' => 130,
                'purchases_count' => 420,
            ],
            [
                'title' => 'Jesus Calling',
                'author' => 'Sarah Young',
                'description' => 'Daily devotional featuring Jesus\' own words of love and encouragement, helping you experience His presence every day.',
                'price' => 12.99,
                'category' => 'devotional',
                'is_featured' => false,
                'preview_pages' => 9,
                'average_rating' => 4.6,
                'ratings_count' => 220,
                'purchases_count' => 650,
            ],
            [
                'title' => 'The Chronicles of Narnia',
                'author' => 'C.S. Lewis',
                'description' => 'A timeless series filled with Christian allegories, following the adventures of children in the magical land of Narnia.',
                'price' => 18.99,
                'category' => 'christian-living',
                'is_featured' => false,
                'preview_pages' => 16,
                'average_rating' => 4.8,
                'ratings_count' => 300,
                'purchases_count' => 800,
            ],
            [
                'title' => 'My Utmost for His Highest',
                'author' => 'Oswald Chambers',
                'description' => 'A classic devotional that challenges readers to give their utmost for God\'s highest purpose.',
                'price' => 11.99,
                'category' => 'devotional',
                'is_featured' => false,
                'preview_pages' => 8,
                'average_rating' => 4.7,
                'ratings_count' => 170,
                'purchases_count' => 520,
            ],
        ];

        foreach ($books as $bookData) {
            $category = Category::where('slug', $bookData['category'])->first();

            if (!$category) {
                continue;
            }

            $book = Book::create([
                'title' => $bookData['title'],
                'author' => $bookData['author'],
                'description' => $bookData['description'],
                'price' => $bookData['price'],
                'category_id' => $category->id,
                'cover_image' => 'books/covers/' . Str::slug($bookData['title']) . '.jpg',
                'file_url' => 'books/pdfs/' . Str::slug($bookData['title']) . '.pdf',
                'preview_pages' => $bookData['preview_pages'],
                'average_rating' => $bookData['average_rating'],
                'ratings_count' => $bookData['ratings_count'],
                'purchases_count' => $bookData['purchases_count'],
                'is_featured' => $bookData['is_featured'],
                'is_published' => true,
            ]);
        }
    }
}
