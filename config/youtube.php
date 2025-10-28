<?php

return [
    'api_key' => env('YOUTUBE_API_KEY'),
    'channel_id' => env('YOUTUBE_CHANNEL_ID'),
    'max_results' => (int) env('YOUTUBE_MAX_RESULTS', 50),
];

