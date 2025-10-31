<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Sermon;
use App\Enums\SermonType;
use Illuminate\Database\Seeder;

class SermonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sermons = [
            [
                'title' => 'Walking in Faith',
                'description' => 'A powerful message about trusting in God\'s plan for your life and walking in complete faith.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor John Smith',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2400,
                'category' => 'sunday-service',
            ],
            [
                'title' => 'The Power of Prayer',
                'description' => 'Discover the transformative power of prayer in your daily walk with God.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor Mary Johnson',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2700,
                'category' => 'bible-study',
            ],
            [
                'title' => 'God\'s Grace and Mercy',
                'description' => 'Understanding the depth of God\'s grace and experiencing His mercy in our lives.',
                'type' => SermonType::Audio,
                'speaker' => 'Pastor David Williams',
                'audio_file_url' => 'https://example.com/audio/grace-mercy.mp3',
                'duration' => 2100,
                'category' => 'sunday-service',
            ],
            [
                'title' => 'Overcoming Temptation',
                'description' => 'Biblical strategies for overcoming temptation and living in victory.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor John Smith',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 3000,
                'category' => 'bible-study',
            ],
            [
                'title' => 'Building Godly Character',
                'description' => 'Developing character traits that honor God and bless others.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor Mary Johnson',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 3300,
                'category' => 'prayer-meeting',
            ],
            [
                'title' => 'Kingdom Principles',
                'description' => 'Exploring the principles that govern the Kingdom of God.',
                'type' => SermonType::Audio,
                'speaker' => 'Pastor David Williams',
                'audio_file_url' => 'https://example.com/audio/kingdom-principles.mp3',
                'duration' => 3600,
                'category' => 'sunday-service',
            ],
            [
                'title' => 'Finding Purpose in Life',
                'description' => 'How to discover and fulfill God\'s purpose for your life.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor John Smith',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2700,
                'category' => 'youth-service',
            ],
            [
                'title' => 'Walking in the Spirit',
                'description' => 'Living a life led by the Holy Spirit and walking in spiritual victory.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor Mary Johnson',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 3000,
                'category' => 'sunday-service',
            ],
            [
                'title' => 'The Love of God',
                'description' => 'Understanding and experiencing the unconditional love of God.',
                'type' => SermonType::Audio,
                'speaker' => 'Pastor David Williams',
                'audio_file_url' => 'https://example.com/audio/love-of-god.mp3',
                'duration' => 2400,
                'category' => 'bible-study',
            ],
            [
                'title' => 'Healing and Restoration',
                'description' => 'God\'s promise of healing and restoration in every area of life.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor John Smith',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2700,
                'category' => 'prayer-meeting',
            ],
            [
                'title' => 'Financial Stewardship',
                'description' => 'Biblical principles for managing finances and being a faithful steward.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor Mary Johnson',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2400,
                'category' => 'sunday-service',
            ],
            [
                'title' => 'Building Strong Relationships',
                'description' => 'How to build godly relationships in family, friendships, and community.',
                'type' => SermonType::Audio,
                'speaker' => 'Pastor David Williams',
                'audio_file_url' => 'https://example.com/audio/strong-relationships.mp3',
                'duration' => 3300,
                'category' => 'special-events',
            ],
            [
                'title' => 'The Armor of God',
                'description' => 'Putting on the full armor of God for spiritual warfare.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor John Smith',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 3000,
                'category' => 'bible-study',
            ],
            [
                'title' => 'Living in Excellence',
                'description' => 'Pursuing excellence in everything we do for the glory of God.',
                'type' => SermonType::Video,
                'speaker' => 'Pastor Mary Johnson',
                'youtube_video_id' => 'dQw4w9WgXcQ',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration' => 2700,
                'category' => 'youth-service',
            ],
            [
                'title' => 'The Joy of Salvation',
                'description' => 'Rejoicing in the salvation we have in Christ Jesus.',
                'type' => SermonType::Audio,
                'speaker' => 'Pastor David Williams',
                'audio_file_url' => 'https://example.com/audio/joy-salvation.mp3',
                'duration' => 2400,
                'category' => 'sunday-service',
            ],
        ];

        foreach ($sermons as $index => $sermonData) {
            $category = Category::where('slug', $sermonData['category'])->first();

            if (!$category) {
                continue;
            }

            $sermon = Sermon::create([
                'title' => $sermonData['title'],
                'description' => $sermonData['description'],
                'type' => $sermonData['type'],
                'speaker' => $sermonData['speaker'],
                'date' => now()->subDays(rand(1, 180)),
                'duration' => $sermonData['duration'],
                'category_id' => $category->id,
                'thumbnail_url' => 'https://placehold.co/640x360?text=' . urlencode($sermonData['title']),
                'is_published' => true,
                'is_featured' => $index < 3, // First 3 as featured
                'views' => rand(100, 5000),
                'favorites_count' => rand(0, 100),
            ]);

            // Add video/audio specific fields
            if ($sermonData['type'] === SermonType::Video && isset($sermonData['youtube_video_id'])) {
                $sermon->update([
                    'youtube_video_id' => $sermonData['youtube_video_id'],
                    'youtube_video_url' => $sermonData['youtube_video_url'],
                ]);
            }

            if ($sermonData['type'] === SermonType::Audio && isset($sermonData['audio_file_url'])) {
                $sermon->update([
                    'audio_file_url' => $sermonData['audio_file_url'],
                ]);
            }
        }
    }
}
