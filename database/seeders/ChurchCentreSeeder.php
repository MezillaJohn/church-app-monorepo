<?php

namespace Database\Seeders;

use App\Models\ChurchCentre;
use Illuminate\Database\Seeder;

class ChurchCentreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centres = [
            [
                'name' => 'Headquarters',
                'address' => '123 Main Church Street',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'country' => 'Nigeria',
                'contact_phone' => '+234 800 123 4567',
                'contact_email' => 'hq@godhouse.org',
                'is_active' => true,
            ],
            [
                'name' => 'Abuja Branch',
                'address' => '45 Unity Avenue',
                'city' => 'Abuja',
                'state' => 'FCT',
                'country' => 'Nigeria',
                'contact_phone' => '+234 800 123 4568',
                'contact_email' => 'abuja@godhouse.org',
                'is_active' => true,
            ],
            [
                'name' => 'Port Harcourt Branch',
                'address' => '78 Garden City Road',
                'city' => 'Port Harcourt',
                'state' => 'Rivers',
                'country' => 'Nigeria',
                'contact_phone' => '+234 800 123 4569',
                'contact_email' => 'ph@godhouse.org',
                'is_active' => true,
            ],
        ];

        foreach ($centres as $centre) {
            ChurchCentre::firstOrCreate(
                ['name' => $centre['name']],
                $centre
            );
        }
    }
}
