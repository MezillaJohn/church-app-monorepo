<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class EventStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalEvents = Event::whereNull('parent_event_id')->count();
        $upcomingEvents = Event::whereNull('parent_event_id')
            ->where('event_date', '>=', now()->toDateString())
            ->count();
        
        $liveEvents = Event::whereNull('parent_event_id')
            ->get()
            ->filter(fn ($event) => $event->isLive())
            ->count();
        
        $publishedEvents = Event::whereNull('parent_event_id')
            ->where('is_published', true)
            ->count();

        return [
            Stat::make('Total Events', $totalEvents)
                ->description('All events')
                ->descriptionIcon('heroicon-o-calendar-days')
                ->color('primary'),
            Stat::make('Upcoming Events', $upcomingEvents)
                ->description('Future events')
                ->descriptionIcon('heroicon-o-arrow-up')
                ->color('success'),
            Stat::make('Live Events', $liveEvents)
                ->description('Currently live')
                ->descriptionIcon('heroicon-o-signal')
                ->color('warning'),
            Stat::make('Published Events', $publishedEvents)
                ->description('Publicly visible')
                ->descriptionIcon('heroicon-o-eye')
                ->color('info'),
        ];
    }
}
