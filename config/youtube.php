<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

$getSetting = function (string $key, $default) {
    try {
        if (app()->runningInConsole() && ! app()->runningUnitTests()) {
            // During migrations, database might not be ready
            if (! Schema::hasTable('settings')) {
                return $default;
            }
        }

        return Setting::get($key, $default);
    } catch (\Exception $e) {
        return $default;
    }
};

return [
    'api_key' => $getSetting('youtube.api_key', env('YOUTUBE_API_KEY')),
    'channel_id' => $getSetting('youtube.channel_id', env('YOUTUBE_CHANNEL_ID')),
    'max_results' => (int) $getSetting('youtube.max_results', env('YOUTUBE_MAX_RESULTS', 50)),
];
