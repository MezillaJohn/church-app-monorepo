<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

$getSetting = function (string $key, $default) {
    try {
        if (app()->runningInConsole() && !app()->runningUnitTests()) {
            if (!Schema::hasTable('settings')) {
                return $default;
            }
        }
        return Setting::get($key, $default);
    } catch (\Exception $e) {
        return $default;
    }
};

return [
    'public_key' => $getSetting('paystack.public_key', env('PAYSTACK_PUBLIC_KEY')),
    'secret_key' => $getSetting('paystack.secret_key', env('PAYSTACK_SECRET_KEY')),
    'merchant_email' => $getSetting('paystack.merchant_email', env('PAYSTACK_MERCHANT_EMAIL')),
    'callback_url' => $getSetting('paystack.callback_url', env('PAYSTACK_CALLBACK_URL', env('APP_URL') . '/api/v1/verify-payment')),
];

