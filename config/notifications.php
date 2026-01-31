<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Expo Push Notification API
    |--------------------------------------------------------------------------
    |
    | Configuration for Expo push notification service
    |
    */

    'expo' => [
        'api_url' => env('EXPO_API_URL', 'https://exp.host/--/api/v2/push/send'),
        'batch_size' => env('EXPO_BATCH_SIZE', 100),
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Notification Settings
    |--------------------------------------------------------------------------
    |
    | Default settings for push notifications
    |
    */

    'defaults' => [
        'sound' => 'default',
        'priority' => 'default',
        'badge' => 1,
    ],
];
