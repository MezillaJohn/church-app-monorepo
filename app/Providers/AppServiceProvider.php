<?php

namespace App\Providers;

use App\Models\Book;
use App\Models\Donation;
use App\Models\Event;
use App\Models\Favorite;
use App\Models\Sermon;
use App\Observers\SermonObserver;
use App\Policies\BookPolicy;
use App\Policies\DonationPolicy;
use App\Policies\EventPolicy;
use App\Policies\FavoritePolicy;
use App\Policies\SermonPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set default string length for MySQL utf8mb4 compatibility
        Schema::defaultStringLength(191);

        // Register policies
        Gate::policy(Sermon::class, SermonPolicy::class);
        Gate::policy(Book::class, BookPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Donation::class, DonationPolicy::class);
        Gate::policy(Favorite::class, FavoritePolicy::class);

        // Register observers
        // Register observers
        Sermon::observe(SermonObserver::class);
        Book::observe(\App\Observers\BookObserver::class);

        // Load Paystack settings from DB
        try {
            if (Schema::hasTable('settings')) {
                config([
                    'paystack.public_key' => \App\Models\Setting::get('paystack.public_key', config('paystack.public_key')),
                    'paystack.secret_key' => \App\Models\Setting::get('paystack.secret_key', config('paystack.secret_key')),
                    'paystack.merchant_email' => \App\Models\Setting::get('paystack.merchant_email', config('paystack.merchant_email')),
                    'paystack.callback_url' => \App\Models\Setting::get('paystack.callback_url', config('paystack.callback_url')),
                ]);
            }
        } catch (\Exception $e) {
            // Log or ignore if DB connection fails (e.g. during install)
        }
    }
}
