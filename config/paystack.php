<?php

return [
    'public_key' => env('PAYSTACK_PUBLIC_KEY'),
    'secret_key' => env('PAYSTACK_SECRET_KEY'),
    'merchant_email' => env('PAYSTACK_MERCHANT_EMAIL'),
    'callback_url' => env('PAYSTACK_CALLBACK_URL', env('APP_URL') . '/api/v1/webhooks/paystack'),
];

