<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the YouTube sync command to run daily at 2 AM
Schedule::command('sermons:sync-youtube')
    ->daily()
    ->at('02:00')
    ->timezone('UTC');
