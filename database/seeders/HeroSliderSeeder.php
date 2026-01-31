<?php

namespace Database\Seeders;

use App\Models\HeroSlider;
use Illuminate\Database\Seeder;

class HeroSliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'title' => 'Welcome to GodHouse',
                'image_path' => 'hero-sliders/welcome-slide.jpg',
                'link_url' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Join Us This Sunday',
                'image_path' => 'hero-sliders/sunday-service.jpg',
                'link_url' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Explore Our Library',
                'image_path' => 'hero-sliders/library.jpg',
                'link_url' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Upcoming Events',
                'image_path' => 'hero-sliders/events.jpg',
                'link_url' => null,
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($sliders as $slider) {
            HeroSlider::updateOrCreate(
                ['title' => $slider['title']], // Match by title
                [
                    'image_path' => $slider['image_path'],
                    'link_url' => $slider['link_url'],
                    'order' => $slider['order'],
                    'is_active' => $slider['is_active'],
                ]
            );
        }

        // Create placeholder images using placehold.co URLs
        // Note: In production, these should be actual uploaded images
        // These are just placeholder paths for seeder data
        $this->command->info('Hero slider seeder completed. Note: Images should be uploaded via Filament admin panel.');
    }
}
