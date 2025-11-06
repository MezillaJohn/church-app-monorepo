<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user if it doesn't exist
        User::firstOrCreate(
            ['email' => 'omolekessiena@gmail.com'],
            [
                'name' => 'Test User',
                'email_verified_at' => now(),
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );

        // Seed categories first (required by other seeders)
        $this->call([
            CategorySeeder::class,
            DonationTypeSeeder::class,
            ChurchCentreSeeder::class,
            EventReminderSettingSeeder::class,
        ]);

        // Seed sermons, books, events, and hero sliders
        $this->call([
            SermonSeeder::class,
            BookSeeder::class,
            EventSeeder::class,
            HeroSliderSeeder::class,
        ]);
    }
}
