<?php

namespace App\Providers;

use App\Models\Book;
use App\Models\Donation;
use App\Models\Event;
use App\Models\Sermon;
use App\Policies\BookPolicy;
use App\Policies\DonationPolicy;
use App\Policies\EventPolicy;
use App\Policies\SermonPolicy;
use Illuminate\Support\Facades\Gate;
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
        // Register policies
        Gate::policy(Sermon::class, SermonPolicy::class);
        Gate::policy(Book::class, BookPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Donation::class, DonationPolicy::class);
    }
}
