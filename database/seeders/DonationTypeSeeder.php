<?php

namespace Database\Seeders;

use App\Models\DonationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DonationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Tithe',
                'description' => 'Regular tithe contributions (10% of income)',
                'is_active' => true,
            ],
            [
                'name' => 'Offering',
                'description' => 'General offerings and contributions',
                'is_active' => true,
            ],
            [
                'name' => 'Special',
                'description' => 'Special purpose donations and projects',
                'is_active' => true,
            ],
            [
                'name' => 'Missions',
                'description' => 'Mission and outreach support',
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            DonationType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
