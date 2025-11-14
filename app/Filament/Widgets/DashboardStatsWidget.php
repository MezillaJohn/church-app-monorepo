<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Event;
use App\Models\Donation;
use App\Models\Sermon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $newUsers = User::where('created_at', '>=', now()->subDays(30))->count();
        
        $totalEvents = Event::whereNull('parent_event_id')->count();
        $upcomingEvents = Event::whereNull('parent_event_id')
            ->where('event_date', '>=', now()->toDateString())
            ->count();
        
        $totalDonations = Donation::count();
        $thisMonthDonations = Donation::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        $totalSermons = Sermon::count();
        $publishedSermons = Sermon::where('is_published', true)->count();

        return [
            Stat::make('Total Users', $totalUsers)
                ->description($newUsers . ' new this month')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
            Stat::make('Upcoming Events', $upcomingEvents)
                ->description($totalEvents . ' total events')
                ->descriptionIcon('heroicon-o-calendar-days')
                ->color('success'),
            Stat::make('This Month Donations', $thisMonthDonations)
                ->description($totalDonations . ' total donations')
                ->descriptionIcon('heroicon-o-heart')
                ->color('warning'),
            Stat::make('Published Sermons', $publishedSermons)
                ->description($totalSermons . ' total sermons')
                ->descriptionIcon('heroicon-o-microphone')
                ->color('info'),
        ];
    }
}


