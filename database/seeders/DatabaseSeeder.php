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
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'email_verified_at' => now(),
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );

        // Seed categories first (required by other seeders)
        $this->call([
            CategorySeeder::class,
        ]);

        // Seed sermons, books, and events
        $this->call([
            SermonSeeder::class,
            BookSeeder::class,
            EventSeeder::class,
        ]);
    }
}
