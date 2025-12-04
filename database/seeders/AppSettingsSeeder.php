<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppSettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set(
            'app.android_version',
            '1.0.0',
            'string',
            'app',
            'Android app version number'
        );

        Setting::set(
            'app.ios_version',
            '1.0.0',
            'string',
            'app',
            'iOS app version number'
        );

        Setting::set(
            'app.android_download_url',
            'https://play.google.com/store/apps/details?id=com.godhouse.app',
            'string',
            'app',
            'Google Play Store download URL for Android app'
        );

        Setting::set(
            'app.ios_download_url',
            'https://apps.apple.com/app/godhouse/id123456789',
            'string',
            'app',
            'Apple App Store download URL for iOS app'
        );
    }
}
