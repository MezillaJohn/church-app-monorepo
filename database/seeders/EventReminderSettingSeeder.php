<?php

namespace Database\Seeders;

use App\Models\EventReminderSetting;
use Illuminate\Database\Seeder;

class EventReminderSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'name' => 'At event time',
                'minutes_before' => 0,
                'is_active' => true,
            ],
            [
                'name' => '10 minutes before',
                'minutes_before' => 10,
                'is_active' => true,
            ],
            [
                'name' => '1 hour before',
                'minutes_before' => 60,
                'is_active' => true,
            ],
            [
                'name' => '6 hours before',
                'minutes_before' => 360,
                'is_active' => true,
            ],
            [
                'name' => '1 day before',
                'minutes_before' => 1440,
                'is_active' => true,
            ],
        ];

        foreach ($settings as $setting) {
            EventReminderSetting::firstOrCreate(
                ['minutes_before' => $setting['minutes_before']],
                $setting
            );
        }
    }
}
